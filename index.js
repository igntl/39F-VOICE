const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;

// ✅ تم إضافة الروم حقك
const CHANNEL_ID = "1483676942698811543";

// 📿 أذكار
const azkar = [
  "📿 سبحان الله وبحمده سبحان الله العظيم",
  "🤍 لا إله إلا الله وحده لا شريك له",
  "💚 الحمد لله رب العالمين",
  "🕌 الله أكبر",
  "🌿 استغفر الله العظيم وأتوب إليه"
];

// 📖 آيات
const ayat = [
  "﴿ وَذَكِّرْ فَإِنَّ الذِّكْرَىٰ تَنفَعُ الْمُؤْمِنِينَ ﴾",
  "﴿ إِنَّ مَعَ الْعُسْرِ يُسْرًا ﴾",
  "﴿ فَاذْكُرُونِي أَذْكُرْكُمْ ﴾",
  "﴿ وَاللَّهُ خَيْرُ الرَّازِقِينَ ﴾"
];

// 🕌 أحاديث
const ahadith = [
  "قال ﷺ: أحب الكلام إلى الله سبحان الله وبحمده",
  "قال ﷺ: من قال لا إله إلا الله دخل الجنة",
  "قال ﷺ: الدين النصيحة"
];

// 🤲 أدعية
const duaa = [
  "🤲 اللهم اغفر لنا ولوالدينا",
  "🤍 اللهم ارزقنا الجنة",
  "🌿 اللهم اجعلنا من الذاكرين",
  "💚 اللهم فرج همومنا"
];

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  // 🌅 أذكار الصباح
  setInterval(() => {
    channel.send("🌅 أذكار الصباح:\n\nاللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور 🤍");
  }, 1000 * 60 * 60 * 24);

  // 🌙 أذكار المساء
  setInterval(() => {
    channel.send("🌙 أذكار المساء:\n\nاللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير 🤍");
  }, 1000 * 60 * 60 * 24 + 1000 * 60 * 60 * 12);

  // 📿 ذكر كل ساعة
  setInterval(() => {
    const random = azkar[Math.floor(Math.random() * azkar.length)];
    channel.send(random);
  }, 1000 * 60 * 60);

  // 📖 آية كل 3 ساعات
  setInterval(() => {
    const random = ayat[Math.floor(Math.random() * ayat.length)];
    channel.send("📖 " + random);
  }, 1000 * 60 * 60 * 3);

  // 🕌 حديث كل 4 ساعات
  setInterval(() => {
    const random = ahadith[Math.floor(Math.random() * ahadith.length)];
    channel.send("🕌 " + random);
  }, 1000 * 60 * 60 * 4);

  // 🤲 دعاء كل ساعتين
  setInterval(() => {
    const random = duaa[Math.floor(Math.random() * duaa.length)];
    channel.send(random);
  }, 1000 * 60 * 60 * 2);

});

client.login(TOKEN);
