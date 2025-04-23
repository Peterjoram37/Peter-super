const axios = require("axios");
const FormData = require("form-data");
const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
  cmd: ["backgroundremove", "bgremove"],
  desc: "Ondoa background ya picha",
  category: "tools",
  async handler(m, { sock }) {
    if (!m.quoted?.imageMessage) return m.reply("🖼️ Tafadhali mjibu picha kwa kutumia .backgroundremove");

    const buffer = await downloadMediaMessage(m.quoted, "buffer", {}, { logger: console, reuploadRequest: sock.sendMessage.bind(sock) });

    const form = new FormData();
    form.append("image_file", buffer, { filename: "image.jpg" });

    try {
      const res = await axios.post("https://api.remove.bg/v1.0/removebg", form, {
        headers: {
          ...form.getHeaders(),
          "X-Api-Key": "bA6J4R3FFuibBoa4uC2tzHDk"
        },
        responseType: "arraybuffer",
      });

      return sock.sendMessage(m.chat, { image: res.data, caption: "✅ Background imeondolewa!" }, { quoted: m });
    } catch (e) {
      console.error(e);
      return m.reply("❌ Imeshindikana kuondoa background. Hakikisha una API Key sahihi.");
    }
  },
};
