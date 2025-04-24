const fetch = require('node-fetch');

const axios = require('axios');

module.exports = {
  name: 'weather',
  description: 'Angalia hali ya hewa ya mji fulani',
  async execute(sock, msg, args) {
    const location = args.join(' ');
    if (!location) {
      return sock.sendMessage(msg.key.remoteJid, { text: '🌤️ Tafadhali weka jina la mji. Mfano: .weather Dar es Salaam' });
    }

    try {
      const res = await axios.get(`http://api.weatherapi.com/v1/current.json?key=060a6bcfa19809c2cd4d97a212b19273&q=${location}`);
      const w = res.data;

      const weatherText = `🌤️ *Hali ya Hewa - ${w.location.name}, ${w.location.country}*\n
🌡️ Joto: ${w.current.temp_c}°C
☁️ Hali: ${w.current.condition.text}
💨 Upepo: ${w.current.wind_kph} km/h`;

      await sock.sendMessage(msg.key.remoteJid, { text: weatherText });
    } catch (e) {
      await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Samahani, siwezi kupata hali ya hewa sasa.' });
    }
  }
};






