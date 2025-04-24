module.exports = {
  name: 'jibu',
  description: 'Jibu la haraka kwa neno au swali',
  async execute(sock, msg, args) {
    const question = args.join(' ').toLowerCase();
    if (!question) {
      return sock.sendMessage(msg.key.remoteJid, { text: '❓ Tafadhali uliza swali mfano: .jibu je, upo?' });
    }

    let answer = '🤔 Samahani, sijui jibu la hilo.';

    if (question.includes('upo')) answer = 'Nipo! 😊';
    else if (question.includes('habari')) answer = 'Nzuri sana! Na wewe je?';
    else if (question.includes('jina lako')) answer = 'Mimi ni Peter Joram 🤖';
    else if (question.includes('unaweza')) answer = 'Naweza kusaidia kwa mambo mengi! Andika .menu uone.';

    await sock.sendMessage(msg.key.remoteJid, { text: answer });
  }
};
