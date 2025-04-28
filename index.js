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
    const commandName = command.cmd?.[0] || command.name; // Chukua jina la kwanza la cmd au name
    if (commandName) {
        commands.set(commandName, command);
    }
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
            const shouldReconnect = lastDisconnect?.error instanceof Boom && lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
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

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;
        const senderName = msg.pushName || 'User';

        if (!text) return;

        // Commands
        if (text.startsWith('.')) {
            const args = text.trim().split(/ +/);
            const commandName = args.shift().slice(1).toLowerCase();

            const command = commands.get(commandName);
            if (command) {
                try {
                    if (command.handler) {
                        await command.handler(msg, { sock, args, senderName });
                    } else if (command.execute) {
                        await command.execute(sock, msg, args, senderName);
                    } else {
                        console.error(`Command ${commandName} haina handler au execute method.`);
                    }
                } catch (err) {
                    console.error(err);
                    await sock.sendMessage(sender, { text: '❌ Kulitokea kosa wakati wa kutekeleza amri.' });
                }
            } else {
                await sock.sendMessage(sender, { text: `❌ Amri haijulikani: ${commandName}` });
            }
        }
    });
}

startBot();
