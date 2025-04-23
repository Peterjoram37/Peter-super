import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys'
import ffmpeg from 'fluent-ffmpeg'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_info')

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Connection closed due to', lastDisconnect?.error, ', reconnecting:', shouldReconnect)
      if (shouldReconnect) {
        startBot()
      }
    } else if (connection === 'open') {
      console.log('✅ PETER POWER MD BOT IMEUNGANISHWA NA WHATSAPP')
    }
  })

  const commands = new Map()
  const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
    const command = await import(`./commands/${file}`)
    commands.set(command.default.name, command.default)
  }

  const linkRegex = /https?:\/\/[^\s]+/

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0]
    if (!msg.message || msg.key.fromMe) return

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    const sender = msg.key.remoteJid

    if (linkRegex.test(text)) {
      await sock.sendMessage(sender, { text: '⚠️ *Warning:* Sending links is not allowed in this group!' })
    }

    if (text?.startsWith('.')) {
      const args = text.trim().split(/ +/)
      const commandName = args.shift().slice(1).toLowerCase()
      const command = commands.get(commandName)

      if (command) {
        const senderName = msg.pushName || 'User'
        try {
          await command.execute(sock, msg, args, senderName)
        } catch (err) {
          console.error(err)
          await sock.sendMessage(sender, { text: '❌ Error running command.' })
        }
      }
    }

    if (msg.message.imageMessage) {
      const imageBuffer = await sock.downloadMediaMessage(msg)
      await sock.sendMessage(sender, { sticker: imageBuffer })
    }

    if (msg.message.audioMessage) {
      const audioBuffer = await sock.downloadMediaMessage(msg)
      await sock.sendMessage(sender, { text: 'Transcribed audio text' })
    }

    if (text && text.toLowerCase() !== 'hello' && text.toLowerCase() !== 'hi') {
      try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: text }],
        }, {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
          }
        })
        const reply = response.data.choices[0].message.content
        await sock.sendMessage(sender, { text: reply })
      } catch (err) {
        console.error('ChatGPT API Error:', err)
        await sock.sendMessage(sender, { text: 'Sorry, I could not process your request right now.' })
      }
    }

    if (text?.toLowerCase() === 'hello' || text?.toLowerCase() === 'hi') {
      await sock.sendMessage(sender, { text: '👋 Hello
