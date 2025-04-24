const axios = require("axios");
const translate = require("@vitalets/google-translate-api");

module.exports = {
  name: 'word',
  description: 'Tafsiri neno kwa Kiingereza',
  async execute(sock, msg, args) {
    const word = args.join(' ');
    if (!word) {
      return sock.sendMessage(msg.key.remoteJid, { text: '📖 Tafadhali andika neno. Mfano: .word mti' });
    }

    try {
      const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = res.data[0];

      const meaning = data.meanings.map(m => `• ${m.partOfSpeech}: ${m.definitions[0].definition}`).join('\n');

      await sock.sendMessage(msg.key.remoteJid, {
        text: `📚 *Maana ya "${data.word}"*:\n${meaning}`
      });
    } catch (err) {
      await sock.sendMessage(msg.key.remoteJid, { text: '😕 Neno halijapatikana.' });
    }
  }
};
