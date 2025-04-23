const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const { downloadMediaMessage } = require("@whiskeysockets/baileys"); // depending on your project setup

module.exports = {
  cmd: ["remini", "ng'arisha", "enhance"],
  desc: "Ng'arisha picha kwa AI",
  category: "tools",
  async handler(m, { sock, mime }) {
    if (!m.quoted || !m.quoted.imageMessage) return m.reply("📸 Tafadhali mjibu picha kwa kutumia .remini");

    const mediaPath = await downloadMediaMessage(
      m.quoted,
      "buffer",
      {},
      { logger: console, reuploadRequest: sock.sendMessage.bind(sock) }
    );

    const form = new FormData();
    form.append("image", mediaPath, { filename: "image.jpg" });

    try {
      const response = await axios.post("https://api.deepai.org/api/torch-srgan", form, {
        headers: {
          ...form.getHeaders(),
          "api-key": "46c2af57-292d-444b-aa22-ca58fa617752", 
        },
        responseType: "arraybuffer",
      });

      const enhancedBuffer = Buffer.from(response.data, "binary");
      return sock.sendMessage(m.chat, { image: enhancedBuffer, caption: "✨ Hii hapa picha yako iliyong'arishwa!" }, { quoted: m });

    } catch (e) {
      console.error(e);
      return m.reply("😢 Samahani, imeshindikana kung'arisha picha. Jaribu tena.");
    }
  },
};
