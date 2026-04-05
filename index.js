const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const express = require("express");

const app = express();

// 🌐 حل مشكلة Render (مهم جدًا)
app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(3000, () => {
  console.log("🌐 Web server ready");
});

// 🤖 البوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

// 🎧 مسار الصوت (لازم يكون نفس الاسم)
const AUDIO_FILE = "./vine-boom.mp3";

let interval = null;

// 🚀 تشغيل البوت
client.once("ready", () => {
  console.log(`✅ ${client.user.tag} شغال`);
});

// 🎯 الأوامر
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // ▶️ دخول وتشغيل الصوت
  if (msg.content === "!join") {
    if (!msg.member.voice.channel) {
      return msg.reply("❌ ادخل روم صوتي أول");
    }

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(AUDIO_FILE);

    player.play(resource);
    connection.subscribe(player);

    msg.reply("🔊 دخلت وشغلت الصوت");
  }

  // 🔁 سبام صوت
  if (msg.content === "!spam") {
    if (!msg.member.voice.channel) {
      return msg.reply("❌ ادخل روم صوتي أول");
    }

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    interval = setInterval(() => {
      const resource = createAudioResource(AUDIO_FILE);
      player.play(resource);
      connection.subscribe(player);
    }, 4000); // كل 4 ثواني

    msg.reply("🔥 بدأ السبام الصوتي");
  }

  // ⛔ إيقاف
  if (msg.content === "!stop") {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    msg.reply("🛑 تم إيقاف السبام");
  }
});

client.login(TOKEN);
