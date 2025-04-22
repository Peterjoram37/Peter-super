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
module.exports = {
  name: 'qr',
  description: 'Generate a QR code from text and send it as an image',
  async execute(sock, msg, args) {
    const text = args.join(' '); // Combine the text provided by the user
    
    if (!text) {
      await sock.sendMessage(msg.key.remoteJid, { text: 'Please provide text to generate a QR code.' });
      return;
    }

    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

      // Download the QR code image
      const response = await axios({
        method: 'get',
        url: qrCodeUrl,
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data, 'binary');
      const imagePath = path.join(__dirname, 'qr-code.png');
      
      // Save the QR code image
      fs.writeFileSync(imagePath, imageBuffer);

      // Send the image to the WhatsApp group/chat
      await sock.sendMessage(msg.key.remoteJid, { 
        image: fs.readFileSync(imagePath), 
        caption: `Here is the QR code for: ${text}` 
      });

      // Clean up the image file after sending
      fs.unlinkSync(imagePath);
    } catch (error) {
      console.error('Error generating QR code:', error);
      await sock.sendMessage(msg.key.remoteJid, { text: 'Sorry, I encountered an error while generating the QR code.' });
    }
  }
};
