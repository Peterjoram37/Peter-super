module.exports = {
  name: 'info',
  description: 'Pata taarifa kuhusu mtumiaji',
  async execute(sock, msg) {
    const jid = msg.key.participant || msg.key.remoteJid;
    const contact = await sock.onWhatsApp(jid);
    const name = msg.pushName || 'Haijulikani';
    const number = jid.split('@')[0];

    const info = `
ℹ️ *Taarifa za Mtumiaji*
────────────────────
👤 *Jina:* ${name}
📞 *Namba:* wa.me/${number}
📡 *JID:* ${jid}
📆 *Muda:* ${new Date().toLocaleString('sw-TZ')}
    `;

    await sock.sendMessage(msg.key.remoteJid, { text: info });
  }
};
