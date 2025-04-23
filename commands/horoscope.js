const axios = require("axios");

module.exports = {
  cmd: ["horoscope", "nyota", "zodiac"],
  desc: "Utabiri wa nyota leo",
  category: "fun",
  async handler(m, { text }) {
    if (!text) return m.reply("Tafadhali andika jina la nyota yako. Mfano: .horoscope libra");

    try {
      const { data } = await axios.get(`https://aztro.sameerkumar.website/?sign=${text.toLowerCase()}&day=today`, {
        method: "POST",
      });

      const msg = `🔮 *Horoscope ya leo kwa ${text.toUpperCase()}*\n\n` +
        `*Date:* ${data.current_date}\n` +
        `*Mood:* ${data.mood}\n` +
        `*Lucky Number:* ${data.lucky_number}\n` +
        `*Lucky Color:* ${data.color}\n` +
        `*Compatibility:* ${data.compatibility}\n` +
        `*Prediction:* ${data.description}`;

      return m.reply(msg);
    } catch (err) {
      return m.reply("😕 Samahani, tafadhali hakikisha jina la nyota limeandikwa vizuri.");
    }
  },
};
