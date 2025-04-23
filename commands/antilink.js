const fs = require('fs');
const path = './database/antilink.json';

// Hakikisha folder ipo, kama haipo, liunde
if (!fs.existsSync('./database')) {
  fs.mkdirSync('./database');
}

// Hakikisha file ipo, kama halipo, liunde
if (!fs.existsSync(path)) {
  fs.writeFileSync(path, JSON.stringify({}));
}

module.exports = {
  name: 'antilink',
  description: 'Washa au zima mfumo wa kuzuia link group.',
  async execute(sock, msg, args) {
    const isGroup = msg.key.remoteJid.endsWith('@g.us');
    if (!isGroup) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Amri hii ni kwa magroup tu.' }, { quoted: msg });
    }

    const isAdmin = msg.key.fromMe || (msg.participant?.admin || '').includes('admin');
    if (!isAdmin) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '🛑 Huna ruhusa ya kutumia amri hii.' }, { quoted: msg });
    }

    const groupId = msg.key.remoteJid;
    const data = JSON.parse(fs.readFileSync(path));
    const status = args[0] === 'on' ? true : args[0] === 'off' ? false : null;

    if (status === null) {
      return await sock.sendMessage(groupId, { text: '✍️ Tumia:\n.antilink on - kuwasha\n.antilink off - kuzima' }, { quoted: msg });
    }

    data[groupId] = status;
    fs.writeFileSync(path, JSON.stringify(data, null, 2));

    const txt = status
      ? '✅ Anti-Link imewashwa. Bot itazuia link yoyote!'
      : '❌ Anti-Link imezimwa. Watu sasa wanaweza kutuma link.';

    await sock.sendMessage(groupId, { text: txt }, { quoted: msg });
  }
};
