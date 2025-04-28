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
