const axios = require('axios');

module.exports = {
    name: 'facebook',
    alias: ['fb', 'fbvideo'],
    description: 'Pakua video kutoka Facebook',
    category: 'Downloader',
    use: '.facebook <link>',
    async run(client, message, args) {
        try {
            if (!args[0]) {
                return message.reply('❗ Tafadhali weka link ya Facebook. Mfano: .facebook https://fb.watch/abc123/');
            }

            const url = args[0];
            message.reply('⏳ Inatafuta video...');

            // API ya kudownload video ya Facebook (free/public ones)
            const apiUrl = `https://api.lolhuman.xyz/api/facebook?apikey=b879d4a76cabda29a6f4eebd&url=${encodeURIComponent(url)}`;

            const { data } = await axios.get(apiUrl);

            if (data.status !== 200) {
                return message.reply('❌ Imeshindikana kudownload video. Hakikisha link ni sahihi.');
            }

            const videoUrl = data.result.link;

            await client.sendMessage(message.chat, { video: { url: videoUrl }, caption: '✅ Hii hapa video yako kutoka Facebook!' }, { quoted: message });
        } catch (error) {
            console.error(error);
            message.reply('❌ Hitilafu imetokea wakati wa kudownload video.');
        }
    }
}
