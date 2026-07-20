// Cloudflare Worker - "loceng pintu" webhook Telegram untuk Cabin Rose.
//
// Aliran:
//   Owner pos gambar / hantar /notis dalam group Telegram
//     -> Telegram TOLAK update ke Worker ini (webhook, ~1 saat)
//     -> Worker cetus GitHub Actions (repository_dispatch: telegram-update)
//     -> agent.py webhook proses mesej itu -> notis/gambar naik ke laman
//
// Worker ini TIDAK simpan token bot dan TIDAK muat turun gambar - ia hanya
// menghantar metadata mesej ke GitHub, dan agent.py (yang ada TELEGRAM_TOKEN
// dalam secrets repo) yang memuat turun & memproses.
//
// Secrets/vars diperlukan (set dalam tetapan Worker - lihat worker/SETUP.md):
//   GH_TOKEN           (secret) fine-grained PAT, Contents: Read and write, repo cabinrose
//   TG_WEBHOOK_SECRET  (secret) rentetan rawak; sama dengan secret_token setWebhook
//   GH_OWNER           (var)    midikeko-del
//   GH_REPO            (var)    cabinrose

export default {
  async fetch(request, env) {
    // Telegram hanya hantar POST. Apa-apa lain (cth lawatan pelayar) -> 200 kosong.
    if (request.method !== "POST") {
      return new Response("cabinrose telegram worker", { status: 200 });
    }

    // Sahkan permintaan betul-betul dari Telegram. secret_token ditetapkan
    // masa setWebhook; Telegram hantar balik dalam header ini setiap kali.
    if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== env.TG_WEBHOOK_SECRET) {
      return new Response("forbidden", { status: 403 });
    }

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("ok", { status: 200 }); // jangan suruh Telegram cuba semula
    }

    const msg = update.message || update.channel_post;
    if (msg) {
      const text = (msg.caption || msg.text || "").trim();
      const isCommand = text.startsWith("/");
      const hasPhoto = Array.isArray(msg.photo) && msg.photo.length > 0;
      // Cetus untuk apa-apa arahan slash (/notis, /wajibcuba, ...) atau gambar.
      // Chatter teks biasa dalam group diabaikan supaya tak membazir larian
      // GitHub Actions. (Arahan bergambar spt /wajibcuba diliputi hasPhoto
      // juga, tapi generalisasi ini future-proof arahan teks-sahaja nanti.)
      if (isCommand || hasPhoto) {
        await triggerGitHub(env, msg);
      }
    }

    // Sentiasa 200 - kalau tidak Telegram akan cuba semula berulang kali.
    return new Response("ok", { status: 200 });
  },
};

async function triggerGitHub(env, message) {
  const url = `https://api.github.com/repos/${env.GH_OWNER}/${env.GH_REPO}/dispatches`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GH_TOKEN}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "User-Agent": "cabinrose-telegram-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      event_type: "telegram-update",
      client_payload: { message },
    }),
  });
  if (!resp.ok) {
    console.log("GitHub dispatch gagal:", resp.status, await resp.text());
  }
}
