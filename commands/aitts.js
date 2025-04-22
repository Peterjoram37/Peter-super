require('dotenv').config();

const axios = require('axios'); // Assuming you're using axios for the API request
const fs = require('fs');
const path = require('path');

const ELEVENLAB_API_KEY = process.env.ELEVENLAB_API_KEY; // Load the API key from environment variable

module.exports = {
  name: 'aitts',
  description: 'Convert text to speech with Eleven Labs API',
  async execute(sock, msg, args) {
    const text = args.join(' ');

    if (!text) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Please provide some text to convert to speech.' });
      return;
    }

    try {
      const response = await axios.post(
        'https://api.elevenlabs.io/v1/speech/synthesize', // Replace with the correct API endpoint
        {
          text: text,
          voice: 'en_us_male', // voice parameter
          // Add other request params if necessary
        },
        {
          headers: {
            'Authorization': `Bearer ${ELEVENLAB_API_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const audioContent = response.data.audio_content; // Assuming the API returns audio content in this field
      
      const audioPath = path.join(__dirname, 'output.mp3');
      fs.writeFileSync(audioPath, Buffer.from(audioContent, 'base64'));

      await sock.sendMessage(msg.key.remoteJid, { audio: fs.readFileSync(audioPath), mimetype: 'audio/mp4', ptt: true });

      fs.unlinkSync(audioPath); // Clean up the audio file

    } catch (error) {
      console.error('Error in Eleven Labs text-to-speech:', error);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Sorry, I encountered an error while converting text to speech.' });
    }
  }
};
