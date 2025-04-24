module.exports = {
  name: 'broadcast',
  description: 'Tuma ujumbe kwa magroup yote',
  async execute(sock, msg, args) {
    if (!msg.key.fromMe) return sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Ni admin tu anaweza kutumia hii command.' });

    const text = args.join(' ');
    if (!text) return sock.sendMessage(msg.key.remoteJid, { text: '📢 Andika ujumbe. Mfano: .broadcast Hello watu!' });

    const chats = await sock.groupFetchAllParticipating();
    for (let jid in chats) {
      await sock.sendMessage(jid, { text });
    }

    await sock.sendMessage(msg.key.remoteJid, { text: `✅ Ujumbe umetumwa kwa magroup yote.` });
  }
};
