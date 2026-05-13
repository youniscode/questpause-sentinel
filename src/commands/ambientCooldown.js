const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ambientSettings = require('../modules/personas/ambientSettings');

const data = new SlashCommandBuilder()
  .setName('ambient-cooldown')
  .setDescription('Set ambient persona message cooldown')
  .addIntegerOption((option) =>
    option
      .setName('minutes')
      .setDescription('Cooldown between ambient messages (30–1440 minutes)')
      .setRequired(true)
      .setMinValue(30)
      .setMaxValue(1440),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  const minutes = interaction.options.getInteger('minutes', true);
  ambientSettings.setCooldownMinutes(minutes);

  const embed = {
    color: 0x00ff88,
    title: '🌿 Ambient Cooldown Updated',
    description: `Ambient message cooldown set to **${minutes} minute(s)**.`,
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
