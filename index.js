const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

// 🔊 رابط صوت مباشر (يشتغل 100%)
const SOUND_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_7b3e9fefc1.mp3";

let connection = null;
let player = createAudioPlayer();
let isLooping = false;

// تشغيل الصوت
async function playSound() {
  const stream = await play.stream(SOUND_URL);
  const resource = createAudioResource(stream.stream, {
    inputType: stream.type
  });
  player.play(resource);
}

// إعادة تلقائية
player.on(AudioPlayerStatus.Idle, () => {
  if (isLooping) {
    playSound();
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const channel = msg.member.voice.channel;

  // دخول + تشغيل
  if (msg.content === "!join") {

    if (!channel) {
      return msg.reply("❌ ادخل روم صوتي");
    }

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    connection.subscribe(player);

    isLooping = false;
    await playSound();

    msg.reply("🎧 دخل وشغل الصوت");
  }

  // سبام
  if (msg.content === "!loop") {

    if (!connection) {
      return msg.reply("❌ استخدم !join أول");
    }

    isLooping = true;
    await playSound();

    msg.reply("🔁 بدأ السبام");
  }

  // إيقاف
  if (msg.content === "!stop") {

    isLooping = false;

    if (connection) {
      connection.destroy();
      connection = null;
    }

    msg.reply("🛑 وقف");
  }
});

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} شغال`);
});

client.login(TOKEN);
