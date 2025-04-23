module.exports = {
  name: 'update',
  description: 'Onyesha taarifa za update za bot',
  async execute(sock, msg, args, senderName) {
    const jid = msg.key.participant || msg.key.remoteJid;
    const num = jid.split('@')[0];
    const time = new Date().toLocaleTimeString('sw-TZ');
    const date = new Date().toLocaleDateString('sw-TZ');

    const updateText = `╭━━━〔 *👑UPDATE - STATUS* 〕━━━⬣
┃ 🤖 *Mtumiaji:* ${senderName}
┃ 📞 *Namba:* wa.me/${num}
┃ 🕒 *Muda:* ${time}
┃ 📅 *Tarehe:* ${date}
╰━━━━━━━━━━━━━━━━━━━━⬣

🔄 *Update Details*:

🔸 *Version:* v1.0.0 (latest)
🔸 *Update Status:* Bot ni mpya na inaendelea kuboreshwa.
🔸 *Latest Features:*
  - Multi-language Support
  - ChatGPT-powered Q&A
  - Anti-Link, Anti-Delete systems
  - Fun & Games features
  - Scheduled messages & auto replies

🔔 *Bot will automatically update every time new features are added.*
🌐 *Repo:* github.com/Mrskymax/Peter-super
🔰 *Bot by:* Peter Joram Devs`;

    try {
      await sock.sendMessage(msg.key.remoteJid, { text: updateText }, { quoted: msg });
    } catch (error) {
      console.error('Error sending update:', error);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Sorry, I could not process your update request right now.' }, { quoted: msg });
    }
  }
};
