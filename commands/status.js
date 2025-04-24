module.exports = {
  name: 'status',
  description: 'Angalia hali ya bot',
  async execute(sock, msg) {
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024;
    const uptime = process.uptime();

    await sock.sendMessage(msg.key.remoteJid, {
      text: `📊 *Bot Status*\n\n⏱️ Uptime: ${Math.floor(uptime)}s\n📈 Memory Usage: ${memoryUsage.toFixed(2)} MB`
    });
  }
};


