const fetch = require('node-fetch');

module.exports = {
  name: 'weather',
  alias: ['weather', 'haliyanga'],
  category: 'tools',
  desc: 'Angalia hali ya hewa kwa jiji lolote',
  use: '.weather Dar es Salaam',
  async execute(sock, m, { args }) {
    const apiKey = '060a6bcfa19809c2cd4d97a212b19273'; // badilisha hii na key yako
    const location = args.join(" ");
    
    if (!location) return m.reply("⚠️ Tafadhali taja mji. Mfano: .weather Arusha");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric&lang=sw`
      );
      const data = await response.json();

      if (data.cod !== 200) return m.reply(`⚠️ Samahani, mji "${location}" haujapatikana.`);

      const { name, sys, weather, main, wind } = data;
      const desc = weather[0].description;
      const temp = main.temp;
      const feels_like = main.feels_like;
      const humidity = main.humidity;
      const wind_speed = wind.speed;

      const result = `🌤️ *Hali ya Hewa kwa ${name}, ${sys.country}*
      
📍 Maelezo: ${desc}
🌡️ Joto: ${temp}°C (Nahisi: ${feels_like}°C)
💧 Unyevu: ${humidity}%
🌬️ Upepo: ${wind_speed} m/s`;

      m.reply(result);
    } catch (err) {
      console.error(err);
      m.reply("⚠️ Kuna tatizo wakati wa kupata taarifa za hali ya hewa.");
    }
  }
};
