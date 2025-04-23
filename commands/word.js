const axios = require("axios");
const translate = require("@vitalets/google-translate-api");

module.exports = {
  cmd: ["word", "neno", "dictionary"],
  desc: "Angalia maana ya neno",
  category: "tools",
  async handler(m, { text, args }) {
    if (!text) return m.reply("Tafadhali andika neno unalotaka kutafuta. Mfano: .word love");

    try {
      // Tafuta maana ya neno kwa kutumia dictionary API
      const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
      const def = data[0].meanings[0].definitions[0].definition;
      
      // Tafsiri maana ya neno kwenye Kiswahili (au lugha nyingine)
      const translation = await translate(def, { to: 'sw' });
      
      // Rudisha majibu kwa mtumiaji
      return m.reply(`📖 *${text.toUpperCase()}*: ${def}\n\nTafsiri: ${translation.text}`);
    } catch (err) {
      return m.reply("😕 Samahani, siwezi kupata maana ya neno hilo.");
    }
  },
};
