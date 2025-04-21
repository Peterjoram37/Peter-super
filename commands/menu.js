module.exports = {
  name: 'menu',
  description: 'Main command menu',
  type: 'command',
  async execute(sock, msg, args, senderName) {
    const menuText = `
╭━━⊰ 🤖 *PETER SUPER BOT* ⊱━━╮
┃ 🧍‍♂️ Name: *${senderName}*
┃ 📱 Number: *${msg.key.remoteJid.replace('@s.whatsapp.net', '')}*
┃ 🔧 Bot by: *Mrskymax*
╰━━━━━━━━━━━━━━━━━━╯

📚 *MAIN MENU* 📚
╭──────────────
┃ 💬 .menu
┃ 🔗 Anti-link system
┃ 🤖 Auto-reply
┃ 🎙️ Media tools
┃ 🧠 ChatGPT
╰──────────────

❓Tumia amri moja mfano: *.menu*
    `;

    await sock.sendMessage(msg.key.remoteJid, { text: menuText }, { quoted: msg });
  }
};
