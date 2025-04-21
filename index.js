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

  // Example handler for incoming messages
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const sender = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    console.log(`📩 Ujumbe kutoka kwa ${sender}: ${text}`);

    if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
      await sock.sendMessage(sender, { text: '👋 Hello! Nipo hewani!' });
    }
  });
}

startBot();
