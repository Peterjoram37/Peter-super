require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const googleTTS = require('google-tts-api');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
let latestQR = '';

const commands = new Map();

// Load all command files
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.set(command.cmd?.[0] || command.name, command);
}

app.get('/qr', async (req, res) => {
  if (!latestQR) return res.send('⏳ QR code haijapatikana bado. Tafadhali subiri...');
  const qrImg = await qrcode.toDataURL(latestQR);
  res.send(`
    <html>
      <head><title>QR Code - Peter Super</title></head>
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

// Function to convert text to speech using google-tts-api
async function convertTextToSpeech(text) {
  return googleTTS.getAudioUrl(text, {
    lang: 'sw',
    slow: false,
    host: 'https://translate.google.com',
  });
}

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
      console.log('❌ Connection closed due to:', lastDisconnect?.error);
      if (shouldReconnect) {
        console.log('🔄 Reconnecting...');
        startBot();
      } else {
        console.log('🚫 Logged out. Please delete auth_info and restart.');
      }
    } else if (connection === 'open') {
      console.log('✅ PETER SUPER MD BOT IMEUNGANISHWA NA WHATSAPP');
      latestQR = '';

      // Notify bot owner
      const ownerNumber = '255677780801@s.whatsapp.net';
      sock.sendMessage(ownerNumber, {
        text: '🤖 Bot yako imeunganishwa kikamilifu na WhatsApp! 🎉'
      });
    }
  });

  const linkRegex = /https?:\/\/[\S]+/;

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid;

    if (!sender.endsWith('@s.whatsapp.net') && !sender.endsWith('@g.us')) return;

    // Anti-Link
    if (text && linkRegex.test(text)) {
      await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' });
    }

    // Command handling
    if (text?.startsWith('.')) {
      const args = text.trim().split(/ +/);
      const commandName = args.shift().slice(1).toLowerCase();

      // Special command: .speech
      if (commandName === 'speech') {
        const content = args.join(' ');
        if (content) {
          try {
            const audioUrl = await convertTextToSpeech(content);
            await sock.sendMessage(sender, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true });
          } catch (err) {
            console.error(err);
            await sock.sendMessage(sender, { text: '❌ Imeshindikana kutafsiri maandishi kuwa sauti.' });
          }
        } else {
          await sock.sendMessage(sender, { text: '✍️ Tafadhali andika maandishi ya kutafsiri kuwa sauti. Mfano: *.speech Habari yako*' });
        }
        return;
      }

      const command = commands.get(commandName);
      if (command) {
        const senderName = msg.pushName || 'User';
        try {
          await command.handler(msg, { sock, args, senderName });
        } catch (err) {
          console.error(err);
          await sock.sendMessage(sender, { text: '❌ Error running command.' });
        }
      }
    }

    // Image to sticker
    if (msg.message.imageMessage) {
      const imageBuffer = await sock.downloadMediaMessage(msg);
      await sock.sendMessage(sender, { sticker: imageBuffer });
    }

    // Audio to text (placeholder only)
    if (msg.message.audioMessage) {
      const audioBuffer = await sock.downloadMediaMessage(msg);
      await sock.sendMessage(sender, { text: '🔊 (Sample text) Sauti yako imetambuliwa.' });
    }

    // ChatGPT API - Intelligent reply
    if (text && !text.startsWith('.') && !['hi', 'hello', 'bye', 'help'].includes(text.toLowerCase())) {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
        }, {
          headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        const reply = response.data.choices[0].message.content;
        await sock.sendMessage(sender, { text: reply });
      } catch (err) {
        console.error('ChatGPT API Error:', err);
        await sock.sendMessage(sender, { text: 'Samahani, siwezi kujibu kwa sasa.' });
      }
    }

    // Simple Auto-replies
    if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
      await sock.sendMessage(sender, { text: '👋 Hello! How can I assist you today?' });
    } else if (text?.toLowerCase() === 'bye') {
      await sock.sendMessage(sender, { text: '👋 Goodbye! Have a great day!' });
    } else if (text?.toLowerCase() === 'help') {
      await sock.sendMessage(sender, {
        text: '🤖 Peter Power WhatsApp Bot:\n• `.speech` - Tafsiri maandishi kuwa sauti\n• `.tempmail new` - Tengeneza email ya muda\n• `.tempmail inbox` - Angalia ujumbe kwenye email ya muda\n• Zaidi zinakuja hivi karibuni!'
      });
    }
  });
}

startBot();
