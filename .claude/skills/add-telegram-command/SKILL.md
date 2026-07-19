---
name: add-telegram-command
description: >-
  Add a new Telegram bot command (modelled on the existing /notis) to the Cabin
  Rose agent, so the owner can drive the live website by posting in the Telegram
  group. Use whenever the user wants a new slash-command that reacts to what the
  owner sends — for example the pending /wajibcuba (update the four homepage
  "Yang Wajib Cuba" highlights), or any "/<something>" that should change site
  content, a popup, the gallery, opening hours, etc. Trigger on "tambah arahan
  telegram", "buat command telegram baru", "macam /notis tapi untuk X",
  "/wajibcuba", or any request to control the site from Telegram. Reach for this
  skill before hand-rolling ad-hoc message parsing — the pipeline has a specific
  shape and one easy-to-miss gotcha (the Worker forward filter).
---

# Add a new Telegram command to the Cabin Rose agent

## The pipeline you're extending

```
Owner posts in group  →  Cloudflare Worker (worker/worker.js)  →  GitHub
repository_dispatch  →  agent.py webhook mode  →  process_message()  →  handler
```

A command flows all the way through only if **every** stage passes it along.
Miss one and it fails silently. The existing `/notis` is your reference
implementation — copy its shape rather than inventing a new one.

Key files:

- `agent.py` — `process_message()` routes by text prefix; `handle_notis()` is
  the handler template; `process_notis()` / `write_notis_active()` show the
  "write a JSON source of truth" pattern.
- `worker/worker.js` — the **forward filter** decides which messages reach
  GitHub at all. **This is the gotcha.** Today it forwards a message only if it
  is `/notis` **or** has a photo. A new command that is text-only (no photo)
  is dropped by the Worker and your handler never runs.
- `tools/build-notis.php` — turns the JSON source of truth into HTML injected
  between `<!-- AUTO-NOTIS:START/END -->` markers; `build-en.php` must run
  after it.
- `.github/workflows/weekly-agent.yml` — runs the build scripts each run.
- `CLAUDE.md` — where the command's contract gets documented.

## Step 1 — Fix the Worker filter (do this first, it's the easy miss)

Open `worker/worker.js`. The current filter is:

```js
const isNotis = text.startsWith("/notis");
const hasPhoto = Array.isArray(msg.photo) && msg.photo.length > 0;
if (isNotis || hasPhoto) { await triggerGitHub(env, msg); }
```

Generalise it so **any** slash-command is forwarded, while ordinary group
chatter is still ignored (that filter exists purely to avoid wasting Actions
runs on "hello" messages):

```js
const isCommand = text.startsWith("/");
const hasPhoto = Array.isArray(msg.photo) && msg.photo.length > 0;
if (isCommand || hasPhoto) { await triggerGitHub(env, msg); }
```

Redeploy the Worker (Cloudflare dashboard → edit code → Deploy, or
`wrangler deploy`). Skipping this is the #1 reason a new command "does
nothing." If the new command always comes with a photo, `hasPhoto` already
covers it — but generalising is safer and future-proofs the next command.

## Step 2 — Decide the data model

Mirror `/notis`: a single JSON **source of truth** plus a build script.

- `img/<feature>.json` — the current state (like `img/notis.json`).
- `tools/build-<feature>.php` — reads that JSON and injects/clears an
  `<!-- AUTO-<FEATURE>:START/END -->` block in `index.html`. Keep the source
  of truth in JSON, not in `index.html` directly — the site has no backend, so
  everything is regenerated at build time.

Watch the repo conventions (see `CLAUDE.md`): files are **CRLF**, so build
scripts must match with **regex**, not literal `\n`; run `build-en.php` after
every content change; never reintroduce `localStorage`; never claim JAKIM
halal certification.

## Step 3 — Add the handler in agent.py

In `process_message()`, add a branch beside the `/notis` one:

```python
if text.lower().startswith("/wajibcuba"):
    handle_wajibcuba(text, msg, token, chat_id)
    return "wajibcuba dikendali"
```

Write `handle_wajibcuba()` modelled on `handle_notis()`:

- Parse the arguments off the command text; validate them.
- **Reply to the group** with `tg_send()` — success, or a *specific* rejection
  reason (missing photo / bad slot number / etc.). The owner is not watching
  Actions logs; the bot's reply is their only feedback.
- Download any photo with `download_photo()`, process it (reuse the resize /
  webp recipe if it's an image), and write the JSON source of truth.
- Return a short log label.

## Step 4 — Wire the build into the workflow

In `.github/workflows/weekly-agent.yml`, add a step that runs
`php tools/build-<feature>.php`. Decide when it should run:

- If the block must self-heal every run (like notis auto-expiry), run it on
  **every** run, unconditionally — same as the "Jana semula popup notis" step.
- Otherwise gate it. Either way, the existing "Jana semula /en/" step
  (`build-en.php`) already runs every run and will regenerate the English page.

## Step 5 — Test before relying on it

- Local dry run: set `TELEGRAM_MESSAGE` to a hand-crafted message JSON and run
  `python agent.py webhook` (mock or accept the real Telegram download call).
- Or live: post the command in the group and watch for the
  `repository_dispatch` run and the resulting commit.
- Verify **both** `/` and `/en/` render correctly.

## Step 6 — Document it

Add a short section to `CLAUDE.md` (follow the `/notis` section's shape) so the
next maintainer knows the command exists, its argument format, and its source
of truth. Update the `pending-followups` memory if this closes a planned item
(e.g. `/wajibcuba`).
