const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ambientSettings = require('../modules/personas/ambientSettings');

const data = new SlashCommandBuilder()
  .setName('ambient-toggle')
  .setDescription('Enable or disable ambient persona messages')
  .addBooleanOption((option) =>
    option
      .setName('enabled')
      .setDescription('Set ambient messages enabled or disabled')
      .setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  const enabled = interaction.options.getBoolean('enabled', true);
  ambientSettings.setEnabled(enabled);

  const embed = {
    color: enabled ? 0x00ff88 : 0xffaa00,
    title: '🌿 Ambient Messages Toggled',
    description: `Ambient persona messages are now **${enabled ? 'enabled' : 'disabled'}**.`,
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
