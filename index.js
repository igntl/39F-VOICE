const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1483676942698811543";

// 📿 قائمة الأذكار
const azkar = [
  "اللهم إني أعوذ بك من شر نفسي ومن شر كل دابة أنت آخذ بناصيتها.",
  "سبحان الله وبحمده سبحان الله العظيم.",
  "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
  "اللهم صل وسلم على نبينا محمد.",
  "أستغفر الله العظيم وأتوب إليه."
];

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} شغال`);

  const channel = client.channels.cache.get(CHANNEL_ID);
  if (!channel) return console.log("❌ الروم غير موجود");

  // ⏱️ كل 10 ثواني (اختبار)
  setInterval(() => {
    const randomZekr = azkar[Math.floor(Math.random() * azkar.length)];

    const embed = new EmbedBuilder()
      .setColor("#00ff88") // لون الشريط الجانبي
      .setTitle("🕊️ ذكر اليوم")
      .setDescription(`**${randomZekr}**\n\n📿 *اذكرني - اذكر الله يذكرك*`)
      .setFooter({ text: "🤍 لا تنس الذكر" });

    channel.send({ embeds: [embed] });

  }, 10000); // 10 ثواني
});

client.login(TOKEN);
