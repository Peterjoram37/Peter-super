require('dotenv').config();
const express = require('express');
const qrcode = require('qrcode');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const googleTTS = require('google-tts-api');

const app = express();
const PORT = process.env.PORT || 3000;

let latestQR = '';
const commands = new Map();

// Soma mafaili yote ya commands
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.cmd?.[0] || command.name, command);
}

// QR Code Page
app.get('/qr', async (req, res) => {
    if (!latestQR) return res.send('⏳ QR bado haijapatikana. Subiri kidogo...');
    const qrImg = await qrcode.toDataURL(latestQR);
    res.send(`
        <html><body style="text-align:center;">
        <h2>Scan QR Code</h2>
        <img src="${qrImg}" />
        </body></html>
    `);
});

app.listen(PORT, () => {
    console.log(`✅ Express Server running at http://localhost:${PORT}`);
});

// Convert text to speech
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
            console.log('❌ Connection closed:', lastDisconnect?.error);
            if (shouldReconnect) {
                console.log('🔄 Reconnecting...');
                startBot();
            } else {
                console.log('🚫 Logged out, delete auth_info and restart.');
            }
        } else if (connection === 'open') {
            console.log('✅ Bot Connected to WhatsApp!');
            latestQR = '';

            // Notify owner
            const ownerNumber = '255677780801@s.whatsapp.net';
            sock.sendMessage(ownerNumber, { text: '🤖 Bot imeunganishwa kikamilifu na WhatsApp! 🎉' });
        }
    });

    const linkRegex = /https?:\/\/[\S]+/;

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;
        const senderName = msg.pushName || 'User';

        if (!sender.endsWith('@s.whatsapp.net') && !sender.endsWith('@g.us')) return;

        // Anti-link system
        if (text && linkRegex.test(text)) {
            await sock.sendMessage(sender, { text: '⚠️ *Onyo:* Hutakiwi kutuma links hapa!' });
        }

        // Commands
        if (text?.startsWith('.')) {
            const args = text.trim().split(/ +/);
            const commandName = args.shift().slice(1).toLowerCase();

            // Special .speech command
            if (commandName === 'speech') {
                const content = args.join(' ');
                if (content) {
                    try {
                        const audioUrl = await convertTextToSpeech(content);
                        await sock.sendMessage(sender, { audio: { url: audioUrl }, mimetype: 'audio/mp4', ptt: true });
                    } catch (err) {
                        console.error(err);
                        await sock.sendMessage(sender, { text: '❌ Imeshindikana kubadilisha maandishi kuwa sauti.' });
                    }
                } else {
                    await sock.sendMessage(sender, { text: '✍️ Andika maandishi mfano: `.speech habari yako`' });
                }
                return;
            }

            // Load custom commands
            const command = commands.get(commandName);
            if (command) {
                try {
                    await command.handler(msg, { sock, args, senderName });
                } catch (err) {
                    console.error(err);
                    await sock.sendMessage(sender, { text: '❌ Kulitokea kosa.' });
                }
            }
        }

        // Image to sticker
        if (msg.message.imageMessage) {
            const imageBuffer = await sock.downloadMediaMessage(msg);
            await sock.sendMessage(sender, { sticker: imageBuffer });
        }

        // Audio to text (sample response)
        if (msg.message.audioMessage) {
            await sock.sendMessage(sender, { text: '🔊 (Mfano) Sauti imepokelewa.' });
        }

        // Auto-replies
        if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
            await sock.sendMessage(sender, { text: '👋 Hello! How can I help you today?' });
        } else if (text?.toLowerCase() === 'bye') {
            await sock.sendMessage(sender, { text: '👋 Goodbye!' });
        } else if (text?.toLowerCase() === 'help') {
            await sock.sendMessage(sender, {
                text: '🤖 *Bot Menu:*\n• `.menu` - Onyesha menu\n• `.speech [text]` - Badilisha maandishi kuwa sauti\n• Na nyingine nyingi zinakuja!'
            });
        }

        // ChatGPT Auto-response
        if (text && !text.startsWith('.')) {
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
                console.error('ChatGPT Error:', err);
                await sock.sendMessage(sender, { text: 'Samahani, siwezi kujibu kwa sasa.' });
            }
        }
    });
}

startBot();
