const axios = require('axios');

module.exports = {
  name: 'horoscope',
  description: 'Angalia nyota yako ya kila siku',
  async execute(sock, msg, args) {
    const sign = args[0]?.toLowerCase();
    if (!sign) {
      return sock.sendMessage(msg.key.remoteJid, {
        text: '🔮 Tafadhali andika nyota yako. Mfano: .horoscope capricorn'
      });
    }

    try {
      const { data } = await axios.get(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
        method: 'POST'
      });

      const response = `🔮 *Horoscope ya leo kwa ${sign.toUpperCase()}*\n\n${data.description}\n\n⭐ Bahati:\n- Upendo: ${data.love}\n- Afya: ${data.health}\n- Kazi: ${data.career}`;
      await sock.sendMessage(msg.key.remoteJid, { text: response });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Samahani, nyota haijapatikana au kuna tatizo.' });
    }
  }
};
