const { SlashCommandBuilder } = require('discord.js');
const ambientSettings = require('../modules/personas/ambientSettings');
const channelGames = require('../config/channelGames');

const data = new SlashCommandBuilder()
  .setName('ambient-status')
  .setDescription('Show ambient persona message system status');

async function execute(interaction) {
  const settings = ambientSettings.getSettings();
  const mappedChannelCount = channelGames.channelToGame.size;

  const embed = {
    color: settings.ambientEnabled ? 0x00ff88 : 0xffaa00,
    title: '🌿 Ambient Persona Messages',
    fields: [
      {
        name: 'Enabled',
        value: settings.ambientEnabled ? '✅ Yes' : '❌ No',
        inline: true,
      },
      {
        name: 'Cooldown',
        value: `${settings.ambientCooldownMinutes} minutes`,
        inline: true,
      },
      {
        name: 'Mapped Persona Channels',
        value: `${mappedChannelCount} channel(s)`,
        inline: true,
      },
      {
        name: 'Note',
        value: 'Ambient messages are disabled in alert, report, and blocked channels.',
      },
    ],
    timestamp: new Date().toISOString(),
  };

  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
