const axios = require("axios");

module.exports = {
  cmd: ["word", "neno", "dictionary"],
  desc: "Angalia maana ya neno",
  category: "tools",
  async handler(m, { text }) {
    if (!text) return m.reply("Tafadhali andika neno unalotaka kutafuta. Mfano: .word love");

    try {
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
      const def = data[0].meanings[0].definitions[0].definition;
      return m.reply(`📖 *${text.toUpperCase()}*: ${def}`);
    } catch (err) {
      return m.reply("😕 Samahani, siwezi kupata maana ya neno hilo.");
    }
  },
};
