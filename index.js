const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@discordjs/voice");

const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const TOKEN = process.env.TOKEN;

let connection = null;
let player = createAudioPlayer();
let isLooping = false;

// 🎧 تشغيل الصوت
function playSound() {
  const resource = createAudioResource(
    path.join(__dirname, "vine-boom.mp3") // 👈 اسم ملفك
  );
  player.play(resource);
}

// 🔁 إعادة تلقائية
player.on(AudioPlayerStatus.Idle, () => {
  if (isLooping) {
    playSound();
  }
});

client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  const channel = msg.member.voice.channel;

  // 🎧 دخول + تشغيل مرة
  if (msg.content === "!join") {

    if (!channel) {
      return msg.reply("❌ ادخل روم صوتي أول");
    }

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: msg.guild.id,
      adapterCreator: msg.guild.voiceAdapterCreator
    });

    connection.subscribe(player);

    isLooping = false;
    playSound();

    msg.reply("🎧 دخل وشغل الصوت");
  }

  // 🔁 سبام
  if (msg.content === "!loop") {

    if (!connection) {
      return msg.reply("❌ استخدم !join أول");
    }

    isLooping = true;
    playSound();

    msg.reply("🔁 بدأ التكرار");
  }

  // 🛑 إيقاف
  if (msg.content === "!stop") {

    isLooping = false;

    if (connection) {
      connection.destroy();
      connection = null;
    }

    msg.reply("🛑 تم الإيقاف");
  }
});

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} شغال`);
});

client.login(TOKEN);
