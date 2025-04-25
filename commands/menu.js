// commands/menu.js
module.exports = {
  name: 'menu',
  cmd: ['menu'],
  handler: async (msg, { sock, senderName }) => {
    const menuText = `👋 Hello *${senderName}*!\n\n📜 _Hii hapa ni menu ya amri za bot:_\n
🗣️ *.speech* - Geuza maandishi kuwa sauti  
🧠 *ChatGPT* - Tuma ujumbe tu na bot itajibu  
🎙️ *Voice to text* - Tuma audio, itageuzwa kuwa maandishi  
🖼️ *Image to sticker* - Tuma picha kupata sticker  
🌐 *Tempmail* - Tengeneza email ya muda  
💬 *help* - Orodha ya msaada (pia auto-reply)\n
🚀 _Zaidi zinakuja karibuni!_`;

    await sock.sendMessage(msg.key.remoteJid, { text: menuText }, { quoted: msg });
  }
};
