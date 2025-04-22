const axios = require('axios');
const config = require('../config'); // Hakikisha una API key kwenye config.js

module.exports = {
  name: 'gpt',
  description: 'Ask any question using ChatGPT',
  async execute(sock, msg, args, senderName) {
    const question = args.join(' ');
    if (!question) {
      await sock.sendMessage(msg.key.remoteJid, { text: '❓ Tafadhali andika swali. Mfano: .gpt Mtu mwenye akili ni nani?' }, { quoted: msg });
      return;
    }

    const loading = await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Natafuta jibu...' }, { quoted: msg });

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Wewe ni msaidizi mwenye akili na unayejua kila kitu.' },
            { role: 'user', content: question }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${config.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const answer = response.data.choices[0].message.content;
      await sock.sendMessage(msg.key.remoteJid, { text: `🤖 ${answer}` }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Samahani, imeshindikana kupata jibu.' }, { quoted: msg });
    } finally {
      await sock.sendMessage(msg.key.remoteJid, { delete: loading.key });
    }
  }
};
