
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
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
      console.log('connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('✅ PETER POWER MD BOT IMEUNGANISHWA NA WHATSAPP');
    }
  });



 
 
  





  // ✅ Load anti-link command
const antiLinkCommand = require('./commands/anti-link');

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

  // Call anti-link if message contains a link
  if (linkRegex.test(text)) {
    antiLinkCommand.execute(sock, msg, args, senderName);
  }
});

  // Image to Sticker
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
  
    if (msg.message.imageMessage) {
      const imageBuffer = await sock.downloadMediaMessage(msg);
      // Convert image to sticker (use libraries like Baileys/Whatsapp-web.js)
      await sock.sendMessage(msg.key.remoteJid, { sticker: imageBuffer });
    }
  
    // Audio to Text
    if (msg.message.audioMessage) {
      const audioBuffer = await sock.downloadMediaMessage(msg);
      // Use an API to convert audio to text (you can use Google Speech-to-Text or similar)
      const audioText = 'Transcribed audio text'; // Replace with actual transcription
      await sock.sendMessage(msg.key.remoteJid, { text: audioText });
    }
  });  
  // ChatGPT Auto-replies
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;
  
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
    const sender = msg.key.remoteJid;
  
    // Calling OpenAI API (ChatGPT)
    if (text && text.toLowerCase() !== 'hello' && text.toLowerCase() !== 'hi') {
      try {
        const response = await axios.post('https://api.openai.com/v1/completions', {
          model: 'gpt-3.5-turbo',  // Use GPT-4 model if available
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
  });
  
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
  
// Auto-reply implementation
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;  // Ignore messages from the bot

  const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
  const sender = msg.key.remoteJid;

  // If the message is "hello" or "hi", the bot will respond with a greeting
  if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
    await sock.sendMessage(sender, { text: '👋 Hello! How can I assist you today?' });
  }
  
  // You can add more auto-replies for other specific messages here
  else if (text?.toLowerCase() === 'bye') {
    await sock.sendMessage(sender, { text: '👋 Goodbye! Have a great day!' });
  }
else if (text?.toLowerCase() === 'help') {
  await sock.sendMessage(sender, { text: 'Peter Power whatsapp bot: 
*Gɪᴠᴇ ᴀ ꜱᴛᴀʀ ᴛᴏ ʀᴇᴘᴏ ꜰᴏʀ ᴄᴏᴜʀᴀɢᴇ* 🌟
https://github.com/Mrskymax/Peter-power-Md

*FACEBOOK SUPPORT* 💭
https://m.me/ch/AbbbaKkM-dWkgJ99

*SUPPORT G-SERVICES*
https://www.godywakala.co.tz

*PETER-POWER-MD--WHATTSAPP-BOT* 🥀 \n- Type "hello" for a greeting. \n- Type "bye" to say goodbye.' });
}

});

// Anti-Link Detection
sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (!msg.message || msg.key.fromMe) return;

  const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

  // Link detection regex pattern (checks for HTTP, HTTPS, and other common links)
  const linkRegex = /https?:\/\/[^\s]+/;

  if (linkRegex.test(text)) {
    const sender = msg.key.remoteJid;

    // Here you can choose to either send a warning or kick the user
    await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' });

    // Uncomment to kick the user (optional)
    // await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], 'remove');

    console.log(`🔗 Link detected from ${sender}: ${text}`);
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
