module.exports = {
  name: 'menu',
  description: 'Orodha ya amri zote za bot',
  async execute(sock, msg, args, senderName) {
    const jid = msg.key.participant || msg.key.remoteJid;
    const num = jid.split('@')[0];
    const time = new Date().toLocaleTimeString('sw-TZ');
    const date = new Date().toLocaleDateString('sw-TZ');

    const menuText = `
╭━━━〔 *👑PETER SUPER - MENU* 〕━━━⬣
┃ 🤖 *Mtumiaji:* ${senderName}
┃ 📞 *Namba:* wa.me/${num}
┃ 🕒 *Muda:* ${time}
┃ 📅 *Tarehe:* ${date}
╰━━━━━━━━━━━━━━━━━━━━⬣

📁 *MAMBO YANAWEZA KUFANYIKA:*

📌 *GENERAL COMMANDS*
│ • .menu - Onyesha menu hii
│ • .hello / hi / bye / help - Majibu ya haraka
│ • .gpt <swali> - ChatGPT Q&A
│ • .translate <lugha> <maneno> - Tafsiri maneno
│ • .broadcast <msg> - Tuma ujumbe kwa kila mtu
│ • .antilink on/off - Zima au washa kinga ya link

🎨 *MEDIA & STICKERS*
│ • .sticker (reply to image/video) - Tengeneza sticker
│ • .toimg (reply to sticker) - Sticker kuwa picha
│ • .tomp3 (reply to video) - Video kuwa sauti
│ • .speech (reply to text) - Maneno kuwa sauti

🧠 *FUN & GAMES*
│ • .game - Chagua mchezo wa kucheza
│ • .mathgame - Hesabu za haraka
│ • .quiz - Majibu sahihi

🛡️ *GROUP FEATURES*
│ • Anti-Link - Zuia watu kutuma link
│ • Anti-Delete - Rudisha meseji zilizofutwa
│ • Auto Welcome - Karibisha member wapya
│ • Captcha - Hakiki kabla ya kuingia

📊 *STATS & TOOLS*
│ • .info - Pata maelezo ya mtumiaji
│ • .status - Hali ya bot
│ • .owner - Namba ya mmiliki

🌐 *Repo:* github.com/Mrskymax/Peter-super
🔰 *Bot by:* Peter joram Devs
    `;

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: 'https://od.lk/s/NzhfNjc1ODI2OTNf/456508666_2508413256010868_5347041524312197800_n.jpg' },
      caption: menuText
    }, { quoted: msg });
  }
};
