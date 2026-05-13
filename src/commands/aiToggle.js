const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('ai-toggle')
  .setDescription('Enable or disable AI Interactive Sentinel')
  .addBooleanOption((opt) =>
    opt.setName('enabled').setDescription('Enable or disable AI Sentinel').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  const enabled = interaction.options.getBoolean('enabled', true);

  process.env.AI_SENTINEL_ENABLED = enabled ? 'true' : 'false';

  const embed = {
    color: enabled ? 0x00ff88 : 0xffaa00,
    title: '🤖 AI Sentinel Toggled',
    description: `AI Interactive Sentinel is now **${enabled ? 'enabled' : 'disabled'}**.`,
    footer: { text: 'Note: This change applies until the bot restarts. Edit .env to persist.' },
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
