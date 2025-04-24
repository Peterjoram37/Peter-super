const yts = require("yt-search");

module.exports = {
  cmd: ["find", "tafuta"],
  desc: "Tafuta video fupi au ndefu YouTube",
  category: "media",
  async handler(m, { sock, args }) {
    const query = args.join(" ");
    if (!query) return m.reply("🔍 Tafadhali andika mada ya kutafuta video mfano: `.find comedy`");

    try {
      const search = await yts(query);
      const videos = search.videos.slice(0, 5); // Chukua video 5 za mwanzo

      if (videos.length === 0) return m.reply("😕 Hakuna video zilizopatikana kwa hilo jina.");

      let response = "*📹 Video zilizopatikana:*\n\n";
      for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        response += `*${i + 1}. ${v.title}*\n⏱️ ${v.timestamp} | 👁️ ${v.views} views\n🔗 ${v.url}\n\n`;
      }

      await sock.sendMessage(m.chat, { text: response }, { quoted: m });
    } catch (e) {
      console.error(e);
      return m.reply("⚠️ Hitilafu imetokea wakati wa kutafuta video.");
    }
  }
};
