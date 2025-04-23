const axios = require("axios");

module.exports = {
  cmd: ["joke", "utani", "cheka"],
  desc: "Pata utani wa kuchekesha",
  category: "fun",
  async handler(m) {
    try {
      const { data } = await axios.get("https://v2.jokeapi.dev/joke/Any?type=single");
      return m.reply("🤣 " + data.joke);
    } catch (err) {
      return m.reply("😅 Samahani, siwezi kupata utani kwa sasa.");
    }
  },
};
