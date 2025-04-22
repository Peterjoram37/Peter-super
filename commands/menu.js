module.exports = {
  name: 'menu',
  description: 'Orodha ya amri zote za bot',
  async execute(sock, msg, args, senderName) {
    const menuText = `
╭━━━〔 *👑 PETER SUPER - MENU* 〕━━━⬣
┃ 🤖 *User:* ${senderName}
┃ 📞 *Namba:* wa.me/${msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0]}
┃ 🕒 *Time:* ${new Date().toLocaleTimeString()}
┃ 📅 *Date:* ${new Date().toLocaleDateString()}
╰━━━━━━━━━━━━━━━━━━━━⬣

📁 *COMMANDS MENU*:

┌──❖
│ 💬 .menu - Orodha hii
│ 💬 .hello / hi / bye / help - Auto-replies
│ 🔗 Anti-link protection - Inafanya kazi kiotomatiki
│ 🎙️ Media Conversion - Image > Sticker, Audio > Text
│ 🤖 ChatGPT QnA - Responds to your text
│ 🔐 Captcha Check - Group verification
└──❖

💡 *More commands coming soon!*
🌐 *Bot repo:* https://github.com/Mrskymax/Peter-super
    `;

    await sock.sendMessage(msg.key.remoteJid, { text: menuText }, { quoted: msg });
  }
};
