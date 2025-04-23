require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
let latestQR = '';

app.get('/qr', async (req, res) => {
  if (!latestQR) return res.send('⏳ QR code haijapatikana bado. Tafadhali subiri...');
  const qrImg = await qrcode.toDataURL(latestQR);
  res.send(`
    <html>
      <head><title>QR Code - Peter Power</title></head>
      <body style="text-align:center;font-family:sans-serif;">
        <h2>Scan QR Code to connect WhatsApp</h2>
        <img src="${qrImg}" />
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) latestQR = qr;

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ PETER POWER MD BOT IMEUNGANISHWA NA WHATSAPP');
      latestQR = '';
    }
  });

  const commands = new Map();
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }

  const linkRegex = /https?:\/\/[\S]+/;

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid;

    if (text && linkRegex.test(text)) {
      await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' });
    }

    if (text?.startsWith('.')) {
      const args = text.trim().split(/ +/);
      const commandName = args.shift().slice(1).toLowerCase();
      const command = commands.get(commandName);

      if (command) {
        const senderName = msg.pushName || 'User';
        try {
          await command.execute(sock, msg, args, senderName);
        } catch (err) {
          console.error(err);
          await sock.sendMessage(sender, { text: '❌ Error running command.' });
        }
      }
    }

    if (msg.message.imageMessage) {
      const imageBuffer = await sock.downloadMediaMessage(msg);
      await sock.sendMessage(sender, { sticker: imageBuffer });
    }

    if (msg.message.audioMessage) {
      const audioBuffer = await sock.downloadMediaMessage(msg);
      await sock.sendMessage(sender, { text: 'Transcribed audio text' });
    }

    if (text && text.toLowerCase() !== 'hello' && text.toLowerCase() !== 'hi') {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
        });
        const reply = response.data.choices[0].message.content;
        await sock.sendMessage(sender, { text: reply });
      } catch (err) {
        console.error('ChatGPT API Error:', err);
        await sock.sendMessage(sender, { text: 'Sorry, I could not process your request right now.' });
      }
    }

    if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
      await sock.sendMessage(sender, { text: '👋 Hello! How can I assist you today?' });
    } else if (text?.toLowerCase() === 'bye') {
      await sock.sendMessage(sender, { text: '👋 Goodbye! Have a great day!' });
    } else if (text?.toLowerCase() === 'help') {
      await sock.sendMessage(sender, {
        text: 'Peter Power WhatsApp Bot: \n- Type "hello" for a greeting. \n- Type "bye" to say goodbye.'
      });
    }
  });
}

startBot();
