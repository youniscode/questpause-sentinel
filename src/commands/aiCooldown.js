const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const aiConfig = require('../config/ai');

const data = new SlashCommandBuilder()
  .setName('ai-cooldown')
  .setDescription('Set AI response cooldown for users')
  .addIntegerOption((opt) =>
    opt.setName('seconds')
      .setDescription('Cooldown between AI responses per user (5–300 seconds)')
      .setRequired(true)
      .setMinValue(5)
      .setMaxValue(300),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  const seconds = interaction.options.getInteger('seconds', true);

  process.env.AI_COOLDOWN_SECONDS = String(seconds);

  const embed = {
    color: 0x00ff88,
    title: '🤖 AI Cooldown Updated',
    description: `AI response cooldown set to **${seconds} second(s)**.`,
    footer: { text: 'Note: This change applies until the bot restarts. Edit .env to persist.' },
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
