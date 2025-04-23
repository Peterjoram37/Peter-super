module.exports = {
  pattern: 'owner',
  alias: ['owner', 'mmiliki'],
  desc: 'Pata namba ya mmiliki wa bot',
  category: 'stats',
  use: '.owner',
  async execute(sock, msg, args, senderName) {
    const ownerNumber = 'wa.me/255677780801'; // Replace with your actual WhatsApp number

    const ownerInfo = `
╭━━━〔 *INFO YA MMILIKI* 〕━━━⬣
┃ 🤖 *Mmiliki wa Bot:* Peter Joram
┃ 📞 *Namba:* ${ownerNumber}
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(msg.key.remoteJid, { text: ownerInfo }, { quoted: msg });
  }
};
