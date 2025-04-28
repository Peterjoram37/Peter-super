const axios = require('axios');

// Hifadhi API key kama constant
const OPENAI_API_KEY = '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';

module.exports = {
  name: 'gpt',
  description: 'Jibu maswali kwa kutumia ChatGPT',
  async execute(sock, msg, args, senderName) {
    const question = args.join(' ');
    if (!question) return sock.sendMessage(msg.key.remoteJid, { text: 'Tafadhali andika swali. Mfano: .gpt Je, AI ni nini?' }, { quoted: msg });

    // Tumia ChatGPT API
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }]
      }, {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
