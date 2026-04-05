const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@discordjs/voice");
const express = require("express");

const app = express();

// 🌐 حل Render
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

// 🔊 رابط صوت جاهز (يشتغل بدون مشاكل)
const AUDIO_URL = "https://www.soundjay.com/buttons/sounds/button-16.mp3";

let interval = null;

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} شغال`);
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // ▶️ تشغيل مرة
  if (msg.content === "!join") {
    if (!msg.member.voice.channel) {
      return msg.reply("❌ ادخل روم صوتي");
    }

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(AUDIO_URL);

    player.play(resource);
    connection.subscribe(player);

    msg.reply("🔊 اشتغلت");
  }

  // 🔁 سبام
  if (msg.content === "!spam") {
    if (!msg.member.voice.channel) {
      return msg.reply("❌ ادخل روم صوتي");
    }

    const connection = joinVoiceChannel({
      channelId: msg.member.voice.channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    interval = setInterval(() => {
      const resource = createAudioResource(AUDIO_URL);
      player.play(resource);
      connection.subscribe(player);
    }, 4000);

    msg.reply("🔥 سبام شغال");
  }

  // ⛔ إيقاف
  if (msg.content === "!stop") {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    msg.reply("🛑 وقفنا");
  }
});

client.login(TOKEN);
