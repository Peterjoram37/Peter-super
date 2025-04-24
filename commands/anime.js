const axios = require("axios");

module.exports = {
  cmd: ["anime"],
  desc: "Tafuta taarifa kuhusu anime kwa jina",
  category: "fun",
  async handler(m, { sock, args }) {
    const query = args.join(" ");
    if (!query) return m.reply("📺 Tafadhali andika jina la anime mfano: `.anime naruto`");

    try {
      const res = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
      const anime = res.data.data[0];

      if (!anime) return m.reply("😢 Samahani, anime hiyo haikupatikana.");

      const caption = `
*📺 Jina:* ${anime.title}
*💠 Jina la Kijapani:* ${anime.title_japanese}
*📅 Imetolewa:* ${anime.aired.string}
*🎞️ Vipindi:* ${anime.episodes}
*⏱️ Muda:* ${anime.duration}
*🔞 Rating:* ${anime.rating}
*⭐ Alama:* ${anime.score}
*📖 Maelezo:* ${anime.synopsis ? anime.synopsis.substring(0, 500) + "..." : "Hakuna maelezo"}
*🔗 Link:* ${anime.url}
      `;

      await sock.sendMessage(m.chat, {
        image: { url: anime.images.jpg.image_url },
        caption
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      return m.reply("⚠️ Hitilafu imetokea. Tafadhali jaribu tena baadaye.");
    }
  }
};
