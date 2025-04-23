module.exports = {
  name: 'ping',
  description: 'Checks bot response time.',
  async execute(sock, msg, args, senderName) {
    const start = Date.now();
    await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
    const end = Date.now();
    const latency = end - start;
    await sock.sendMessage(msg.key.remoteJid, { text: `⏱️ Latency: ${latency}ms` });
  }
};
