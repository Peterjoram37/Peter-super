module.exports = {
  name: 'restart',
  description: 'Washa upya bot',
  async execute(sock, msg) {
    await sock.sendMessage(msg.key.remoteJid, { text: '♻️ Bot is restart...' });
    process.exit(0);
  }
};
