const { exec } = require('child_process');

module.exports = {
  name: 'update',
  description: 'Pakua updates mpya kutoka GitHub',
  async execute(sock, msg) {
    exec('git pull', async (err, stdout, stderr) => {
      if (err) {
        return sock.sendMessage(msg.key.remoteJid, { text: `❌ Error: ${stderr}` });
      }
      await sock.sendMessage(msg.key.remoteJid, { text: `✅ Update successful:\n\n${stdout}` });
    });
  }
};






