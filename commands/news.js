const axios = require("axios");

const axios = require('axios');

module.exports = {
  name: 'news',
  description: 'Habari mpya za dunia',
  async execute(sock, msg) {
    try {
      const res = await axios.get('https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=462225807f0f403c995abde44d4d69e5');
      const news = res.data.articles.map((a, i) => `${i + 1}. *${a.title}*\n${a.url}`).join('\n\n');
      await sock.sendMessage(msg.key.remoteJid, { text: `📰 *Habari Mpya Leo:*\n\n${news}` });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Samahani, siwezi kupata habari kwa sasa.' });
    }
  }
};
















