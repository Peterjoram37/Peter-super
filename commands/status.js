module.exports = {
  pattern: 'status',
  alias: ['status', 'hali'],
  desc: 'Angalia hali ya bot',
  category: 'stats',
  use: '.status',
  async execute(sock, msg, args, senderName) {
    const botStatus = `
╭━━━〔 *Hali ya Bot* 〕━━━⬣
┃ 🤖 *Bot Inafanya Kazi* ✅
┃ 🕒 *Muda wa Uendeshaji:* ${new Date().toLocaleTimeString('sw-TZ')}
┃ 📅 *Tarehe:* ${new Date().toLocaleDateString('sw-TZ')}
┃ 🧠 *Kasi:* Haraka
╰━━━━━━━━━━━━━━━━━━━━⬣
`;

    await sock.sendMessage(msg.key.remoteJid, { text: botStatus }, { quoted: msg });
  }
};
