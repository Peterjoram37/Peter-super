const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ BOT IMEUNGANISHWA NA WHATSAPP');
    }
  });

  // ✅ Hapa tunaanza kugundua commands
  const commands = new Map();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    if (!text || !text.startsWith('.')) return;

    const args = text.trim().split(/ +/);
    const commandName = args.shift().slice(1).toLowerCase();

    const command = commands.get(commandName);
    if (command) {
      const senderName = msg.pushName || 'User';
      try {
        await command.execute(sock, msg, args, senderName);
      } catch (err) {
        console.error(err);
        await sock.sendMessage(msg.key.remoteJid, { text: '❌ Error running command.' }, { quoted: msg });
      }
    }
  });
}

startBot();
