module.exports = {
  name: 'jibu',
  description: 'Jibu swali la game.',
  async execute(sock, msg, args) {
    if (!global.currentGame || global.currentGame.askedBy !== msg.key.remoteJid) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '🚫 Hakuna game inayoendelea sasa.' }, { quoted: msg });
    }

    const userAnswer = args.join(' ').toLowerCase();
    const correct = global.currentGame.answer;

    if (userAnswer === correct) {
      await sock.sendMessage(msg.key.remoteJid, { text: '🎉 Sahihi! Hongera kwa jibu sahihi!' }, { quoted: msg });
    } else {
      await sock.sendMessage(msg.key.remoteJid, { text: `❌ Baya! Jibu sahihi ni: *${correct}*` }, { quoted: msg });
    }

    global.currentGame = null; // Reset game
  }
};
