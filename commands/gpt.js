const axios = require('axios');
const config = require('../config'); // Hakikisha una API key kwenye config.js

module.exports = {
  name: 'gpt',
  description: 'Jibu maswali kwa kutumia ChatGPT',
  async execute(sock, msg, args, senderName) {
    const question = args.join(' ');
    if (!question) return sock.sendMessage(msg.key.remoteJid, { text: 'Tafadhali andika swali. Mfano: .gpt Je, AI ni nini?' }, { quoted: msg });

    // Tumia ChatGPT API (hapa unahitaji kutumia OpenAI API yako)
    try {
      const axios = require('axios');
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }]
      }, {
        headers: {
          'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
          'Content-Type': 'application/json'
        }
      });

      const reply = response.data.choices[0].message.content.trim();
      await sock.sendMessage(msg.key.remoteJid, { text: reply }, { quoted: msg });

    } catch (err) {
      console.error('GPT Error:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Samahani, kuna tatizo katika kupata jibu.' }, { quoted: msg });
    }
  }
};
