const axios = require("axios");

module.exports = {
  cmd: ["getdomain", "domain"],
  desc: "Pata domain bure kwa kutumia jina",
  category: "tools",
  async handler(m, { sock, args }) {
    if (!args[0]) {
      return m.reply("❌ Tafadhali ingiza jina la domain unalotaka kupata. Mfano: `.getdomain example.tk`");
    }

    const domainName = args.join(" ");
    const freenomUrl = `https://www.freenom.com/en/free-dominions.html?search=${domainName}`;
    
    try {
      // Tumekamata jina la domain na kuangalia kama linapatikana bure
      const response = await axios.get(freenomUrl);
      const pageContent = response.data;

      // Tumia Regex kutafuta kama domain linapatikana bure au la
      const domainAvailable = pageContent.includes("is available"); // Hii inategemea na structure ya tovuti

      if (domainAvailable) {
        return sock.sendMessage(m.chat, {
          text: `🎉 Domain *${domainName}* inapatikana bure! Huu hapa uhusiano wa kujiandikisha: https://www.freenom.com/en/free-dominions.html?search=${domainName}`,
        }, { quoted: m });
      } else {
        return sock.sendMessage(m.chat, {
          text: `❌ Samahani, domain *${domainName}* haipatikani bure. Tafadhali jaribu jina lingine.`,
        }, { quoted: m });
      }
    } catch (e) {
      console.error(e);
      return m.reply("⚠️ Samahani, kulikuwa na tatizo la kuwasiliana na huduma ya Freenom.");
    }
  },
};
