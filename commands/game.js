module.exports = {
  name: 'game',
  description: 'Cheza game ndogo ya bahati au quiz.',
  async execute(sock, msg, args) {
    const games = [
      {
        question: '🇰🇪 Rais wa sasa wa Kenya ni nani?',
        answer: 'william ruto'
      },
      {
        question: '⚽ Timu ya taifa ya Brazil inaitwaje?',
        answer: 'selecao'
      },
      {
        question: '🧠 What is the capital city of France?',
        answer: 'paris'
      },
      {
        question: '🎲 Namba ya bahati kati ya 1 hadi 5 ni ipi?',
        answer: `${Math.floor(Math.random() * 5) + 1}`
      }
    ];

    const selected = games[Math.floor(Math.random() * games.length)];

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🎮 *GAME TIME!*\n\n${selected.question}\n\nJibu kwa kuandika tu: .jibu <jibu lako>`
    }, { quoted: msg });

    global.currentGame = {
      answer: selected.answer.toLowerCase(),
      askedBy: msg.key.remoteJid
    };
  }
};
