const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = "1483676942698811543";

// 📿 أذكار
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

// 📖 آيات
const ayat = [
  "﴿ فاذكروني أذكركم ﴾",
  "﴿ إن مع العسر يسرا ﴾",
  "﴿ والله خير الرازقين ﴾",
  "﴿ إن الله مع الصابرين ﴾"
];

// 🕌 أحاديث
const ahadith = [
  "قال ﷺ: أحب الكلام إلى الله سبحان الله وبحمده",
  "قال ﷺ: من قال لا إله إلا الله دخل الجنة",
  "قال ﷺ: الدين النصيحة"
];

// 🤲 أدعية
const duaa = [
  "اللهم اغفر لنا ولوالدينا",
  "اللهم ارزقنا الجنة",
  "اللهم اجعلنا من الذاكرين",
  "اللهم فرج همومنا"
];

let prayerTimes = {};
let lastZekr = "";

// 📥 جلب أوقات الصلاة
async function getPrayerTimes() {
  const res = await fetch("http://api.aladhan.com/v1/timingsByCity?city=Mecca&country=Saudi Arabia&method=4");
  const data = await res.json();

  prayerTimes = {
    Fajr: data.data.timings.Fajr,
    Dhuhr: data.data.timings.Dhuhr,
    Asr: data.data.timings.Asr,
    Maghrib: data.data.timings.Maghrib,
    Isha: data.data.timings.Isha
  };

  console.log("✅ تحديث الصلاة");
}

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag}`);

  const channel = await client.channels.fetch(CHANNEL_ID);

  await getPrayerTimes();
  setInterval(getPrayerTimes, 1000 * 60 * 60 * 24);

  // 📿 أذكار (بدون تكرار)
  setInterval(() => {
    let random;
    do {
      random = azkar[Math.floor(Math.random() * azkar.length)];
    } while (random === lastZekr);

    lastZekr = random;

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🕊️ ذكر")
      .setDescription(`**${random}**\n\n📿 اذكر الله يذكرك`);

    channel.send({ embeds: [embed] });

  }, 1000 * 60 * 10);

  // 📖 آية كل ساعة
  setInterval(() => {
    const random = ayat[Math.floor(Math.random() * ayat.length)];

    channel.send({
      embeds: [new EmbedBuilder()
        .setColor("#3498db")
        .setTitle("📖 آية")
        .setDescription(random)]
    });

  }, 1000 * 60 * 60);

  // 🕌 حديث كل ساعتين
  setInterval(() => {
    const random = ahadith[Math.floor(Math.random() * ahadith.length)];

    channel.send({
      embeds: [new EmbedBuilder()
        .setColor("#9b59b6")
        .setTitle("🕌 حديث")
        .setDescription(random)]
    });

  }, 1000 * 60 * 60 * 2);

  // 🤲 دعاء كل 90 دقيقة
  setInterval(() => {
    const random = duaa[Math.floor(Math.random() * duaa.length)];

    channel.send({
      embeds: [new EmbedBuilder()
        .setColor("#e67e22")
        .setTitle("🤲 دعاء")
        .setDescription(random)]
    });

  }, 1000 * 60 * 90);

  // 🌅 صباح / مساء
  setInterval(() => {
    const time = new Date().toTimeString().slice(0,5);

    if (time === "06:00") {
      channel.send("🌅 أذكار الصباح 🤍");
    }

    if (time === "18:00") {
      channel.send("🌙 أذكار المساء 🤍");
    }

  }, 60000);

  // 🕌 الصلاة
  setInterval(() => {
    const now = new Date().toTimeString().slice(0,5);

    const names = {
      Fajr: "الفجر",
      Dhuhr: "الظهر",
      Asr: "العصر",
      Maghrib: "المغرب",
      Isha: "العشاء"
    };

    for (const key in prayerTimes) {
      if (now === prayerTimes[key]) {

        channel.send({
          embeds: [new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🕌 وقت الصلاة")
            .setDescription(`حان الآن وقت صلاة ${names[key]}`)]
        });
      }
    }

  }, 60000);

});

client.login(TOKEN);
