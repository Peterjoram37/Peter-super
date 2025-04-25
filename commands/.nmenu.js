module.exports = {
  name: 'menu',
  description: 'Orodha ya amri zote za bot',
  async execute(sock, msg, args, senderName) {
    const jid = msg.key.participant || msg.key.remoteJid;
    const num = jid.split('@')[0];
    const time = new Date().toLocaleTimeString('sw-TZ', { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString('sw-TZ');

    const menuText = `
╭━━━〔 👑 *PETER SUPER - MENU* 〕━━━⬣
┃ 🙋‍♂️ *Mtumiaji:* ${senderName}
┃ 📞 *Namba:* wa.me/${num}
┃ 🕒 *Muda:* ${time}
┃ 📅 *Tarehe:* ${date}
╰━━━━━━━━━━━━━━━━━━━━⬣

🧰 *GENERAL COMMANDS*
╭───────────────────╮
│ • *.menu* - Onyesha menu hii
│ • *.hello / .hi / .bye / .help*
│ • *.gpt* <swali> - ChatGPT Q&A
│ • *.translate* <lugha> <maneno>
│ • *.broadcast* <ujumbe>
│ • *.antilink* on/off
│ • *.weather* <mji>
│ • *.anime* <jina>

🎨 *MEDIA & STICKERS*
╭───────────────────╮
│ • *.sticker* - Tengeneza sticker
│ • *.toimg* - Sticker kuwa picha
│ • *.tomp3* - Video kuwa sauti
│ • *.speech* - Maneno kuwa sauti
│ • *.backgroundremove* - Ondoa background kwenye picha
│ • *.cartoon* - Cartoon style
│ • *.oldphoto* - Muonekano wa zamani

🎮 *FUN & GAMES*
╭───────────────────╮
│ • *.game* - Mchezo wa bahati
│ • *.mathgame* - Hesabu za akili
│ • *.quiz* - Majibu sahihi
│ • *.joke* - Vichekesho
│ • *.quote* - Methali / nukuu
│ • *.word* - Tafsiri neno

👥 *GROUP FEATURES*
╭───────────────────╮
│ • Antilink System
│ • Anti-Delete Msg
│ • Auto Welcome Msg
│ • Captcha Verification

🧾 *BOT TOOLS & STATS*
╭───────────────────╮
│ • *.info* - Maelezo ya mtumiaji
│ • *.status* - Bot status
│ • *.owner* - Namba ya mmiliki

📍 *Repo:* github.com/Mrskymax/Peter-super
👑 *Developer:* Peter Joram Devs
    `;

    await sock.sendMessage(msg.key.remoteJid, {
      image: { url: 'https://od.lk/s/NzhfNjc1ODI2OTNf/456508666_2508413256010868_5347041524312197800_n.jpg' },
      caption: menuText
    }, { quoted: msg });
  }
};
