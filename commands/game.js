module.exports = {
  name: 'game',
  description: 'Cheza game ya hesabu ndogo',
  async execute(sock, msg) {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 20);
    const answer = a + b;

    await sock.sendMessage(msg.key.remoteJid, {
      text: `🧠 *Game ya Hesabu!*\n\nNini jibu la:\n${a} + ${b} = ?\n\nTuma jibu lako chini ya sekunde 15.`,
    });

    global.mathAnswers = global.mathAnswers || {};
    global.mathAnswers[msg.key.remoteJid] = {
      answer,
      expires: Date.now() + 15000,
    };
  }
};
