const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1483676942698811543";

// 📿 أذكار متنوعة
const azkar = [
  "سبحان الله وبحمده سبحان الله العظيم",
  "أستغفر الله العظيم وأتوب إليه",
  "اللهم صل وسلم على نبينا محمد",
  "لا إله إلا الله وحده لا شريك له",
  "حسبي الله لا إله إلا هو عليه توكلت",
  "اللهم اغفر لي ولوالدي",
  "اللهم ارزقني حسن الخاتمة",
  "رب اغفر لي وتب علي",
  "فاذكروني أذكركم",
  "إن الصلاة كانت على المؤمنين كتابًا موقوتًا"
];

// 🕌 أوقات الصلاة
let prayerTimes = {};

// 📥 جلب أوقات الصلاة (مكة)
async function getPrayerTimes() {
  try {
    const res = await fetch("http://api.aladhan.com/v1/timingsByCity?city=Mecca&country=Saudi Arabia&method=4");
    const data = await res.json();

    prayerTimes = {
      Fajr: data.data.timings.Fajr,
      Dhuhr: data.data.timings.Dhuhr,
      Asr: data.data.timings.Asr,
      Maghrib: data.data.timings.Maghrib,
      Isha: data.data.timings.Isha
    };

    console.log("✅ تم تحديث أوقات الصلاة");
  } catch (err) {
    console.log("❌ خطأ في جلب أوقات الصلاة");
  }
}

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} شغال`);

  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return console.log("❌ الروم غير موجود");

  // تحميل أوقات الصلاة
  await getPrayerTimes();

  // تحديث يومي
  setInterval(getPrayerTimes, 1000 * 60 * 60 * 24);

  // 📿 أذكار كل 10 دقايق
  setInterval(() => {
    const random = azkar[Math.floor(Math.random() * azkar.length)];

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🕊️ ذكر")
      .setDescription(`**${random}**\n\n📿 اذكر الله يذكرك`)
      .setFooter({ text: "🤍 لا تنس الذكر" });

    channel.send({ embeds: [embed] });

  }, 1000 * 60 * 10);

  // 🕌 فحص الصلاة كل دقيقة
  setInterval(() => {
    const now = new Date();
    const time = now.toTimeString().slice(0,5);

    const names = {
      Fajr: "الفجر",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء"
    };

    for (const key in prayerTimes) {
      if (time === prayerTimes[key]) {

        const embed = new EmbedBuilder()
          .setColor("#FFD700")
          .setTitle("🕌 وقت الصلاة")
          .setDescription(`حان الآن وقت صلاة **${names[key]}**\n\n⏰ لا تنس الصلاة`)
          .setFooter({ text: "الصلاة نور 🤍" });

        channel.send({ embeds: [embed] });
      }
    }

  }, 60000);

});

client.login(TOKEN);
