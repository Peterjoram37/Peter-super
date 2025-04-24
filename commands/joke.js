const axios = require("axios");
const jokes = [
  "😂 Mwalimu: Kwa nini umechelewa?\nMwanafunzi: Nilitumwa kununua muda!",
  "🤣 Je, ni nini tofauti kati ya mpira na somo?\nMpira unaweza kudunda, somo haliwezi!",
  "😅 Unajua kwa nini samaki hawapigi simu?\nKwa sababu wanaogopa kukatika!",
  "😂 Dokta: Unaumwa nini?\nMgonjwa: Naumwa na maisha!",
];

module.exports = {
  name: 'joke',
  description: 'Cheka na mzaha',
  async execute(sock, msg) {
    const random = jokes[Math.floor(Math.random() * jokes.length)];
    await sock.sendMessage(msg.key.remoteJid, { text: random });
  }
};
