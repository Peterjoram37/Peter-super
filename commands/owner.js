module.exports = {
  name: 'owner',
  description: 'Onyesha mawasiliano ya mmiliki wa bot',
  async execute(sock, msg) {
    const ownerNumber = '255677780801'; // badilisha kama si yako
    await sock.sendMessage(msg.key.remoteJid, {
      text: `👑 *Bot developer:* wa.me/${ownerNumber}\nUnaweza kuwasiliana naye kwa msaada au ushauri.`
    });
  }
};
