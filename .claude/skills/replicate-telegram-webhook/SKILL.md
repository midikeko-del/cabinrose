---
name: replicate-telegram-webhook
description: >-
  Set up the whole "instant Telegram → website" automation (Cloudflare Worker
  webhook → GitHub Actions repository_dispatch → Python agent) on a NEW
  project or repo, using the Cabin Rose implementation as the working
  reference. Use when the user wants Telegram-driven updates on a different
  site, says "buat automasi telegram macam cabinrose untuk projek lain", wants
  instant popups/gallery/content on another repo, or asks to replicate this
  webhook pattern anywhere. This is the from-scratch setup runbook — for
  maintaining the existing Cabin Rose one use renew-telegram-token or
  add-telegram-command instead.
---

# Replicate the instant Telegram→site webhook on a new project

Cabin Rose already runs this end to end. Treat its files as the canonical
templates and copy/adapt rather than designing anew:

- `worker/worker.js` — the Cloudflare Worker (the "doorbell").
- `worker/SETUP.md` — the click-by-click account/secret/setWebhook guide.
- `.github/workflows/weekly-agent.yml` — the workflow with the
  `repository_dispatch` trigger and mode routing.
- `agent.py` — `process_message()` + `mode_webhook()` + graceful-409 fetch.

## The one architectural fact that shapes everything

Telegram lets a bot use **either** a webhook **or** `getUpdates` polling —
never both. Setting a webhook makes `getUpdates` return **409 Conflict**. So
once you go webhook, all ingestion must flow through it. Cabin Rose keeps a
daily `getUpdates` run only as a graceful-degradation safety net: it catches
the 409 and skips silently. Design the new project the same way.

## Prerequisites (the user sets these up — accounts/credentials are theirs)

- A GitHub repo with Actions enabled (webhook path only triggers workflows on
  the **default branch**, so the workflow file must be on it).
- A Telegram bot via @BotFather, **privacy mode off** (`/setprivacy`), added to
  the target group. Repo secrets `TELEGRAM_TOKEN`, `TELEGRAM_CHAT_ID`.
- A free Cloudflare account (no card needed for the Workers free tier).

## Step 1 — The Worker

Copy `worker/worker.js`. It needs no changes except its env values. It:

- rejects non-POST and any request whose `X-Telegram-Bot-Api-Secret-Token`
  header ≠ `TG_WEBHOOK_SECRET` (so only Telegram can trigger it);
- forwards a message to GitHub only if it is a slash-command or has a photo
  (ignore ordinary chatter to save Actions runs — widen this per the target's
  needs);
- fires `POST /repos/{owner}/{repo}/dispatches` with
  `event_type: "telegram-update"` and `client_payload: { message }`. It sends
  only message *metadata* (file_ids), never downloads — the agent downloads
  using the bot token it already holds, so the Worker never needs the bot
  token.

Worker secrets/vars: `GH_TOKEN` (fine-grained PAT, **Contents: Read and write**
on the target repo), `TG_WEBHOOK_SECRET` (a random string), `GH_OWNER`,
`GH_REPO`. Full walkthrough: `worker/SETUP.md`.

## Step 2 — The workflow trigger

In the target repo's workflow, add:

```yaml
on:
  repository_dispatch:
    types: [telegram-update]
```

Route it to a webhook mode and pass the message through as an env var (this is
the safe way — it is not shell-interpolated):

```yaml
      - name: Run agent
        env:
          TELEGRAM_TOKEN: ${{ secrets.TELEGRAM_TOKEN }}
          TELEGRAM_CHAT_ID: ${{ secrets.TELEGRAM_CHAT_ID }}
          TELEGRAM_MESSAGE: ${{ toJSON(github.event.client_payload.message) }}
        run: python agent.py webhook
```

For non-dispatch events `client_payload` is absent and `toJSON(...)` yields the
string `null`; the webhook mode should refuse to run on that.

## Step 3 — The agent

Copy the shape from `agent.py`:

- `process_message(msg, token, chat_id)` — one message: route slash-commands to
  handlers, else save/handle the photo. Shared by both modes.
- `mode_webhook()` — read `TELEGRAM_MESSAGE`, `json.loads` it, hand to
  `process_message`. Bail cleanly if empty or `"null"`.
- `mode_fetch()` (optional safety net) — `getUpdates`, but if the response is
  `error_code == 409` (webhook active) print a note and return instead of
  erroring.

## Step 4 — Register the webhook

The user runs, with their bot token (keep it secret — never have them paste it
to you):

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=<WORKER_URL>&secret_token=<SECRET>
```

Verify with `getWebhookInfo` (URL correct, no `last_error_message`). To roll
back to polling: `deleteWebhook`.

## Step 5 — Prove it

Push the workflow to the default branch first (or `repository_dispatch` has
nothing to trigger). Then send a real command in the group and confirm a
`repository_dispatch` run appears within ~1 minute and the expected commit
lands. Watch the concurrency: album posts arrive as separate messages → one run
each; a `concurrency` group with `cancel-in-progress: false` serialises the
repo writes so pushes don't race.
