---
name: renew-telegram-token
description: >-
  Renew the GitHub personal access token (PAT) that lets the Cabin Rose
  Cloudflare Worker trigger GitHub Actions for the Telegram /notis + gallery
  webhook. Use this whenever the Telegram automation silently stops — /notis
  no longer publishes, gallery photos stop appearing, the Worker logs show a
  401/403 from GitHub, or the PAT is near/after its ~1-year expiry
  (first one lapses about 2027-07-19). Also trigger on "tukar token",
  "renew github token", "webhook dah tak jalan", "notis tak naik lagi", or
  when the yearly token reminder fires. Do not wait for the user to name the
  token — if instant Telegram updates broke and nothing changed in the repo,
  suspect the PAT first.
---

# Renew the Cabin Rose webhook GitHub token

## Why this exists

The Cloudflare Worker (`worker/worker.js`) authenticates to GitHub's
`repository_dispatch` API with a **fine-grained PAT**, stored as the Worker
secret `GH_TOKEN`. GitHub PATs expire — this one is created with a 1-year
lifetime. When it lapses:

- Telegram still delivers messages to the Worker (webhook is unaffected).
- The Worker's call to GitHub returns **401 Unauthorized**, so **no**
  `repository_dispatch` fires.
- `/notis` and gallery ingestion silently stop. **Nothing surfaces to the
  owner** — the bot may not even reply, because `handle_notis` runs inside the
  Action that never starts.

That silent-failure mode is exactly why this is easy to miss and worth a skill.

## Step 1 — Confirm it really is the token

Rule out other causes before regenerating. A dead token means the webhook
reaches Cloudflare but never reaches GitHub.

- Check recent Actions runs — after a known `/notis` send, there should be a
  `repository_dispatch` run within ~1 minute:
  ```bash
  curl -s "https://api.github.com/repos/midikeko-del/cabinrose/actions/runs?per_page=10" \
    | grep -E '"event"|"created_at"'
  ```
  No `repository_dispatch` events after the send → the Worker isn't reaching
  GitHub (token or Worker config).
- Confirm the webhook itself is healthy (rules out a Telegram-side problem).
  The user runs this in their browser/terminal with their bot token:
  ```
  https://api.telegram.org/bot<TOKEN>/getWebhookInfo
  ```
  A populated `"last_error_message"` mentioning the Worker URL points at the
  Worker, not the token.
- If the user can open Cloudflare: dashboard → Worker `cabinrose-telegram` →
  **Logs** → look for `GitHub dispatch gagal: 401`. That is the smoking gun.

If a `repository_dispatch` run *does* fire but fails, it's not the token — read
the run logs instead.

## Step 2 — Generate a fresh PAT

The user does this (creating tokens is theirs — never ask them to paste it to
you):

1. <https://github.com/settings/personal-access-tokens/new>
2. **Name:** `cabinrose-telegram-worker`
3. **Expiration:** 1 year (note the new date for the reminder).
4. **Repository access:** *Only select repositories* → `cabinrose`.
5. **Repository permissions → Contents → Read and write** (Metadata read-only
   auto-selects — leave it). This is the exact permission
   `repository_dispatch` needs; nothing more.
6. **Generate token** → copy the `github_pat_...` value.

## Step 3 — Update the Worker secret

1. <https://dash.cloudflare.com> → **Workers & Pages** → `cabinrose-telegram`.
2. **Settings → Variables and Secrets**.
3. Edit **`GH_TOKEN`** (type: Secret) → paste the new token.
4. **Deploy** (the Worker must redeploy for a secret change to take effect).

The other three (`TG_WEBHOOK_SECRET`, `GH_OWNER`, `GH_REPO`) stay unchanged.

## Step 4 — Verify end to end

Ask the owner to send a real test in the Telegram group: a flyer photo with
caption `/notis <a future date>` (e.g. `/notis 31/12/2027`). Then confirm the
pipeline fired:

```bash
# a repository_dispatch run should appear within ~1 min
curl -s "https://api.github.com/repos/midikeko-del/cabinrose/actions/runs?per_page=3" \
  | grep -E '"event"|"conclusion"'
# and notis.json should now carry the active notice
git fetch origin main && git show origin/main:img/notis.json | grep -A6 '"active"'
```

Have them clear the test afterwards with `/notis off` if it wasn't a real
promo.

## Step 5 — Reset the reminder

Update the `pending-followups` memory with the **new** expiry date so the next
renewal reminder fires on time. Without this, the token dies silently again in
a year.
