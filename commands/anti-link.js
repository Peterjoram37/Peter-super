module.exports = {
  name: 'anti-link',
  description: 'Detects and handles links in messages',
  type: 'command',
  async execute(sock, msg, args, senderName) {
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

    // Link detection regex pattern (checks for HTTP, HTTPS, and other common links)
    const linkRegex = /https?:\/\/[^\s]+/;

    if (linkRegex.test(text)) {
      const sender = msg.key.remoteJid;
      await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' });

      // Uncomment to kick the user (optional)
      // await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], 'remove');

      console.log(`🔗 Link detected from ${sender}: ${text}`);
    }
  }
};
