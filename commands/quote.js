const axios = require("axios");
const quotes = [
  "🌟 Usiogope kuanza tena. Mara hii huenda ukafanikiwa!",
  "💡 Elimu ni silaha bora ya kubadilisha dunia - Nelson Mandela",
  "🌈 Kila siku ni nafasi mpya ya kubadili maisha yako.",
  "🔥 Usikate tamaa, ushindi uko karibu!"
];

module.exports = {
  name: 'quote',
  description: 'Pata methali au nukuu ya maisha',
  async execute(sock, msg) {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: random });
  }
};
