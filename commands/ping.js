module.exports = {
  name: 'ping',
  description: 'Check if the bot is online and responsive',
  async execute(sock, msg, args, senderName) {
    await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong! Bot is active.' });
  }
}
