module.exports = {
  name: 'broadcast',
  description: 'Tuma ujumbe kwa magroup/chats yote',
  async execute(sock, msg, args, senderName, isOwner) {
    if (!isOwner) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '⛔ Hii amri ni ya admin tu!' }, { quoted: msg });
    }

    const message = args.join(' ');
    if (!message) {
      return await sock.sendMessage(msg.key.remoteJid, { text: '⚠️ Tafadhali andika ujumbe. Mfano: .broadcast Hello wote!' }, { quoted: msg });
    }

    const chats = await sock.groupFetchAllParticipating();
    const groupIds = Object.keys(chats);

    await sock.sendMessage(msg.key.remoteJid, { text: `📢 Inatuma ujumbe kwa magroup ${groupIds.length}...` }, { quoted: msg });

    for (const groupId of groupIds) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // delay kidogo ili isiblockwe
      await sock.sendMessage(groupId, {
        text: `📢 *TANGAZO KUTOKA KWA ${senderName}:*\n\n${message}`
      });
    }

    await sock.sendMessage(msg.key.remoteJid, { text: '✅ Ujumbe umetumwa kwa magroup yote.' }, { quoted: msg });
  }
};
