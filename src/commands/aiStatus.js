const { SlashCommandBuilder } = require('discord.js');
const aiConfig = require('../config/ai');

const data = new SlashCommandBuilder()
  .setName('ai-status')
  .setDescription('Show AI Interactive Sentinel status');

async function execute(interaction) {
  const fields = [
    { name: 'Enabled', value: aiConfig.enabled ? '✅ Yes' : '❌ No', inline: true },
    { name: 'Provider', value: aiConfig.provider || 'Not configured', inline: true },
    { name: 'Model', value: aiConfig.model || 'Not set', inline: true },
    { name: 'AI Channels', value: `${aiConfig.channelIds.size} channel(s)`, inline: true },
    { name: 'Cooldown', value: `${aiConfig.cooldownSeconds}s`, inline: true },
    { name: 'Max Response', value: `${aiConfig.maxResponseChars} chars`, inline: true },
    { name: 'Safety Mode', value: '🛡️ Active (serious keywords trigger safe reply)', inline: false },
  ];

  const apiKeySet = !!aiConfig.apiKey;

  const embed = {
    color: aiConfig.enabled && apiKeySet ? 0x00ff88 : 0xffaa00,
    title: '🤖 AI Interactive Sentinel',
    fields,
    timestamp: new Date().toISOString(),
  };

  if (!apiKeySet) {
    embed.fields.push({
      name: '⚠️ API Key Missing',
      value: 'Set `AI_API_KEY` and `AI_PROVIDER` in `.env` to enable AI responses.',
    });
  }

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
