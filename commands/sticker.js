const fs = require('fs');
const path = require('path');
const { writeFileSync } = require('fs');

module.exports = {
  name: 'sticker',
  description: 'Tengeneza sticker kutoka picha au video',
  async execute(sock, msg, args, sender, quoted) {
    if (!quoted || !(quoted.message.imageMessage || quoted.message.videoMessage)) {
      return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Reply kwenye picha au video ili kutengeneza sticker.' });
    }

    const messageType = quoted.message.imageMessage ? 'image' : 'video';
    const buffer = await sock.downloadMediaMessage(quoted);

    await sock.sendMessage(msg.key.remoteJid, {
      sticker: buffer,
    }, { quoted: msg });
  }
};
