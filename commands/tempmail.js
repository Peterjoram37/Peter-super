const axios = require("axios");
const { randomBytes } = require("crypto");

const tempMailUsers = {}; // Hifadhi email za muda za watumiaji

module.exports = {
  cmd: ["tempmail"],
  desc: "Pata email ya muda na uangalie inbox",
  category: "tools",
  async handler(m, { sock, args }) {
    const sender = m.sender;
    const subcmd = args[0];

    if (subcmd === "new") {
      const name = randomBytes(5).toString("hex");
      const domains = ["1secmail.com", "1secmail.net", "1secmail.org"];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const email = `${name}@${domain}`;

      tempMailUsers[sender] = { name, domain };
      return m.reply(`📧 Email yako mpya ya muda ni:\n*${email}*\n\nTumia \`.tempmail inbox\` kuangalia ujumbe.`);
    }

    if (subcmd === "inbox") {
      const user = tempMailUsers[sender];
      if (!user) return m.reply("❌ Huna email ya muda. Tumia `.tempmail new` kuunda.");

      const { name, domain } = user;
      try {
        const res = await axios.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${name}&domain=${domain}`);
        const mails = res.data;

        if (mails.length === 0) return m.reply("📭 Hakuna ujumbe mpya kwa sasa.");

        let msg = `📨 *Inbox ya ${name}@${domain}:*\n\n`;
        for (let i = 0; i < mails.length; i++) {
          const mail = mails[i];
          msg += `📧 *${mail.from}*\n📌 *Subject:* ${mail.subject}\n🕒 ${mail.date}\n🔎 ID: ${mail.id}\n\n`;
        }

        return m.reply(msg);
      } catch (err) {
        console.error(err);
        return m.reply("⚠️ Tatizo la kupata ujumbe. Jaribu tena.");
      }
    }

    return m.reply(`📥 *Menyu ya .tempmail:*\n\n• .tempmail new - Tengeneza email ya muda\n• .
