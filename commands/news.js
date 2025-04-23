const axios = require("axios");

module.exports = {
  cmd: ["news", "habari", "breakingnews"],
  desc: "Habari za dunia kwa kifupi",
  category: "tools",
  async handler(m) {
    try {
      const response = await axios.get("https://newsapi.org/v2/top-headlines", {
        params: {
          country: "us",
          apiKey: "462225807f0f403c995abde44d4d69e5", // 
          pageSize: 5,
        },
      });

      const articles = response.data.articles;
      if (articles.length === 0) return m.reply("Hakuna habari mpya kwa sasa.");

      let message = "*📰 Habari za Dunia Leo:*\n\n";
      articles.forEach((article, index) => {
        message += `${index + 1}. *${article.title}*\n${article.url}\n\n`;
      });

      return m.reply(message);
    } catch (error) {
      console.error("News API error:", error);
      return m.reply("😓 Samahani, siwezi kufikia habari kwa sasa.");
    }
  },
};
