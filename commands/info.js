module.exports = {
  pattern: 'info',
  alias: ['info', 'mtumiaji', 'user'],
  desc: 'Pata maelezo ya mtumiaji',
  category: 'stats',
  use: '.info',
  async execute(sock, msg, args, senderName) {
    const jid = msg.key.participant || msg.key.remoteJid;
    const num = jid.split('@')[0];
    const time = new Date().toLocaleTimeString('sw-TZ');
    const date = new Date().toLocaleDateString('sw-TZ');

    const userInfo = `
╭━━━〔 *INFO YA MTUMIAJI* 〕━━━⬣
┃ 🤖 *Mtumiaji:* ${senderName}
┃ 📞 *Namba:* wa.me/${num}
┃ 🕒 *Muda:* ${time}
┃ 📅 *Tarehe:* ${date}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(msg.key.remoteJid, { text: userInfo }, { quoted: msg });
  }
};
