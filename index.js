const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
const ffmpeg = require('fluent-ffmpeg');  // Install ffmpeg package
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');  // Install Axios

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
      console.log('Connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ PETER POWER MD BOT IMEUNGANISHWA NA WHATSAPP');
    }
  });

  // ✅ Load Commands
  const commands = new Map();
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
  }

  // ✅ Anti-Link Detection
  const linkRegex = /https?:\/\/[^\s]+/;

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid;

    // Anti-Link Handler
    if (linkRegex.test(text)) {
      await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' });
      // Optionally, remove the user from the group
      // await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], 'remove');
      console.log(`🔗 Link detected from ${sender}: ${text}`);
    }

    // Handle Commands
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
          await sock.sendMessage(msg.key.remoteJid, { text: '❌ Error running command.' }, { quoted: msg });
        }
      }
    }

    // Image to Sticker
    if (msg.message.imageMessage) {
      const imageBuffer = await sock.downloadMediaMessage(msg);
      await sock.sendMessage(msg.key.remoteJid, { sticker: imageBuffer });
    }

    // Audio to Text
    if (msg.message.audioMessage) {
      const audioBuffer = await sock.downloadMediaMessage(msg);
      const audioText = 'Transcribed audio text'; // Replace with actual transcription
      await sock.sendMessage(msg.key.remoteJid, { text: audioText });
    }

    // ChatGPT Auto-replies
    if (text && text.toLowerCase() !== 'hello' && text.toLowerCase() !== 'hi') {
      try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
          max_tokens: 150
        }, {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
          }
        });
        const reply = response.data.choices[0].message.content;
        await sock.sendMessage(sender, { text: reply });
      } catch (err) {
        console.error('ChatGPT API Error:', err);
        await sock.sendMessage(sender, { text: 'Sorry, I could not process your request right now.' });
      }
    }

    // Auto-reply for specific messages
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

  // ✅ Captcha System for Group Join
  sock.ev.on('group-participants.update', async ({ remoteJid, participants, action }) => {
    if (action === 'add') {
      const user = participants[0];
      await sock.sendMessage(remoteJid, { text: '🔒 *Captcha:* Please reply with "I am human" to enter the group.' });

      // Wait for the user to reply with the captcha response
      sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;

        if (text?.toLowerCase() === 'i am human' && sender === user) {
          await sock.sendMessage(remoteJid, { text: '✅ Captcha passed! Welcome to the group!' });
        } else if (sender === user) {
          await sock.sendMessage(remoteJid, { text: '❌ Incorrect captcha, you have been removed.' });
          await sock.groupParticipantsUpdate(remoteJid, [user], 'remove');
        }
      });
    }
  });

}

startBot();
