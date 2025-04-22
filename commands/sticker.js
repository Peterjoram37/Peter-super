const fs = require('fs');
const path = require('path');
const { writeFileSync } = require('fs');

module.exports = {
  name: 'sticker',
  description: 'Convert image or short video to sticker',
  async execute(sock, msg, args, senderName) {
    const mime = Object.keys(msg.message)[0];
    
    if (mime !== 'imageMessage' && mime !== 'videoMessage') {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Tafadhali tuma picha au video (≤10s) na tumia .sticker kama caption au reply.' }, { quoted: msg });
      return;
    }

    const buffer = await sock.downloadMediaMessage(msg);
    if (!buffer) {
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Imeshindikana kupakua media.' }, { quoted: msg });
      return;
    }

    await sock.sendMessage(msg.key.remoteJid, {
      sticker: buffer,
      mimetype: 'image/webp'
    }, { quoted: msg });
  }
};
