const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  cmd: ["cartoon", "katuni"],
  desc: "Geuza picha kuwa katuni",
  category: "tools",
  async handler(m, { sock }) {
    if (!m.quoted?.imageMessage) return m.reply("🖼️ Tafadhali mjibu picha kwa kutumia .cartoon");

    const buffer = await downloadMediaMessage(m.quoted, "buffer", {}, { logger: console, reuploadRequest: sock.sendMessage.bind(sock) });

    const form = new FormData();
    form.append("image", buffer, { filename: "image.jpg" });

    try {
      const res = await axios.post("https://api.deepai.org/api/toonify", form, {
        headers: {
          ...form.getHeaders(),
          "api-key": "46c2af57-292d-444b-aa22-ca58fa617752"
        },
      });

      const cartoonUrl = res.data.output_url;
      return sock.sendMessage(m.chat, { image: { url: cartoonUrl }, caption: "🎨 Picha yako ya katuni!" }, { quoted: m });

    } catch (e) {
      console.error(e);
      return m.reply("⚠️ Samahani, haikufanikiwa kugeuza picha kuwa katuni.");
    }
  },
};
