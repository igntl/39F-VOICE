const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  Events
} = require("discord.js");

const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const TOKEN = process.env.TOKEN;

// ⚙️ عدل هذي
const STAFF_ROLE = "PUT_ROLE_ID";
const LOG_CHANNEL = "PUT_LOG_CHANNEL_ID";

// 📊 XP
let xp = {};
if (fs.existsSync("xp.json")) {
  xp = JSON.parse(fs.readFileSync("xp.json"));
}

// 🎟️ التذاكر
let openTickets = new Map();

// 🟢 تشغيل
client.once("ready", () => {
  console.log(`✅ ${client.user.tag}`);
});

// 🎟️ بانل
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  // 📊 نظام XP
  if (!xp[msg.author.id]) xp[msg.author.id] = { xp: 0, level: 1 };

  xp[msg.author.id].xp += 5;

  if (xp[msg.author.id].xp >= xp[msg.author.id].level * 100) {
    xp[msg.author.id].xp = 0;
    xp[msg.author.id].level++;

    msg.channel.send(`🎉 ${msg.author} وصلت لفل ${xp[msg.author.id].level}`);
  }

  fs.writeFileSync("xp.json", JSON.stringify(xp, null, 2));

  // 🎟️ بانل
  if (msg.content === "!tic") {

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("🎟️ نظام الدعم")
      .setDescription("اختر نوع التذكرة 👇");

    const menu = new StringSelectMenuBuilder()
      .setCustomId("ticket_select")
      .setPlaceholder("اختر")
      .addOptions([
        { label: "مساعدة", value: "help", emoji: "💬" },
        { label: "إبلاغ", value: "report", emoji: "⚠️" },
        { label: "اقتراح", value: "suggest", emoji: "💡" }
      ]);

    msg.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents(menu)]
    });
  }

  // 📊 أوامر
  if (msg.content === "!rank") {
    const d = xp[msg.author.id];
    msg.reply(`📊 لفل: ${d.level}\nXP: ${d.xp}`);
  }

  if (msg.content === "!top") {
    const sorted = Object.entries(xp)
      .sort((a, b) => b[1].level - a[1].level)
      .slice(0, 10);

    const text = sorted.map((u, i) =>
      `${i+1}- <@${u[0]}> لفل ${u[1].level}`
    ).join("\n");

    msg.channel.send(`🏆 الترتيب:\n${text}`);
  }

});

// 🎯 التذاكر
client.on(Events.InteractionCreate, async (interaction) => {

  const log = client.channels.cache.get(LOG_CHANNEL);

  if (interaction.isStringSelectMenu()) {

    if (openTickets.has(interaction.user.id)) {
      return interaction.reply({ content: "❌ عندك تذكرة", ephemeral: true });
    }

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: interaction.user.id,
      permissionOverwrites: [
        { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        { id: STAFF_ROLE, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
      ]
    });

    openTickets.set(interaction.user.id, channel.id);

    const embed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("🎟️ تذكرة")
      .setDescription(`مرحباً ${interaction.user}`);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("close").setLabel("🔒 إغلاق").setStyle(ButtonStyle.Danger),
      new ButtonBuilder().setCustomId("delete").setLabel("🗑️ حذف").setStyle(ButtonStyle.Secondary)
    );

    await channel.send({ embeds: [embed], components: [row] });

    log?.send(`📩 ${interaction.user} فتح تذكرة`);

    interaction.reply({ content: `تم إنشاء ${channel}`, ephemeral: true });
  }

  if (interaction.customId === "close") {
    await interaction.reply("🔒 تم الإغلاق");
  }

  if (interaction.customId === "delete") {
    await interaction.reply("🗑️ حذف...");
    setTimeout(() => interaction.channel.delete(), 2000);
  }

});

client.login(TOKEN);
