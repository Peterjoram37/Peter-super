{
  pattern: "hacking",
  alias: ["hack", "hacker", "hacked", "hacktheplanet"],
  desc: "Simulates a hacking sequence for fun",
  category: "fun",
  use: ".hacking",
  execute: async (m, { conn }) => {
    let hackingMessages = [
      "Initializing Hack...",
      "Bypassing Security Protocols...",
      "Decrypting Files...",
      "Bypassing Firewall...",
      "Accessing Network...",
      "Entering System...",
      "Hacking Complete: Access Granted.",
    ];
    
    let i = 0;
    const hackingInterval = setInterval(() => {
      if (i < hackingMessages.length) {
        conn.sendMessage(m.chat, hackingMessages[i], { quoted: m });
        i++;
      } else {
        clearInterval(hackingInterval);
        conn.sendMessage(m.chat, "You've successfully 'hacked' the system! 😎", { quoted: m });
      }
    }, 1500); // Adjust speed of the hack simulation
  },
  filename: __filename
}
