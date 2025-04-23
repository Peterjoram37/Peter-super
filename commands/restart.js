module.exports = {
  name: 'restart',
  description: 'Restart the bot',
  async execute(sock, msg, args, senderName) {
    // Hapa tunaangalia kama mtumaji ni mmiliki wa bot
    const ownerNumber = '255677780801@s.whatsapp.net';  // Badilisha na namba yako
    if (msg.key.remoteJid !== ownerNumber) {
      return sock.sendMessage(msg.key.remoteJid, { text: '❌ You are not authorized to restart the bot.' });
    }

    // Tuma ujumbe wa notification kabla ya kuanzisha restart
    await sock.sendMessage(msg.key.remoteJid, { text: '⏳ Bot restarting... Please wait a moment.' });

    // Fanya restart ya server
    process.exit();  // Hii itaachilia server na kusababisha restart
  },
};
