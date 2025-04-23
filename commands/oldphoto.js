const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  cmd: ["oldphoto", "zamani", "oldify"],
  desc: "Geuza picha ionekane kama ya zamani",
  category: "tools",
  async handler(m, { sock }) {
    if (!m.quoted?.imageMessage) return m.reply("🖼️ Tafadhali mjibu picha kwa kutumia .oldphoto");

    const buffer = await downloadMediaMessage(m.quoted, "buffer", {}, { logger: console, reuploadRequest: sock.sendMessage.bind(sock) });

    const form = new FormData();
    form.append("image", buffer, { filename: "image.jpg" });

    try {
      const res = await axios.post("https://api.deepai.org/api/old-photo", form, {
        headers: {
          ...form.getHeaders(),
          "api-key": "46c2af57-292d-444b-aa22-ca58fa617752"
        },
      });

      return sock.sendMessage(m.chat, { image: { url: res.data.output_url }, caption: "📷 Hii hapa picha ya zamani!" }, { quoted: m });

    } catch (e) {
      console.error(e);
      return m.reply("⚠️ Haikuweza kuunda picha ya zamani. Tafadhali jaribu tena.");
    }
  },
};
