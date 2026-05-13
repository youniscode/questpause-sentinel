const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const aiSettings = require('../modules/ai/aiSettings');

const data = new SlashCommandBuilder()
  .setName('ai-toggle')
  .setDescription('Enable or disable AI Interactive Sentinel')
  .addBooleanOption((opt) =>
    opt.setName('enabled').setDescription('Enable or disable AI Sentinel').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  const enabled = interaction.options.getBoolean('enabled', true);

  aiSettings.setEnabled(enabled);

  const embed = {
    color: enabled ? 0x00ff88 : 0xffaa00,
    title: '🤖 AI Sentinel Toggled',
    description: `AI Interactive Sentinel is now **${enabled ? 'enabled' : 'disabled'}**.`,
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
