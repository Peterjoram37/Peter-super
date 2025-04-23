const axios = require("axios");

module.exports = {
  cmd: ["quote", "hekima", "inspire"],
  desc: "Pata nukuu ya hekima",
  category: "fun",
  async handler(m) {
    try {
      const { data } = await axios.get("https://api.quotable.io/random");
      return m.reply(`📝 *${data.content}* \n— _${data.author}_`);
    } catch (err) {
      return m.reply("😓 Siwezi kupata nukuu kwa sasa.");
    }
  },
};
