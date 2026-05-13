const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const personaSettings = require('../modules/personas/personaSettings');
const { gameChannelCounts } = require('../config/channelGames');

const data = new SlashCommandBuilder()
  .setName('persona-status')
  .setDescription('Show persona system status');

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const s = personaSettings.getSettings();

  const gameLines = Object.entries(gameChannelCounts)
    .filter(([, count]) => count > 0)
    .map(([game, count]) => `• ${game}: ${count} channel(s)`)
    .join('\n') || 'None configured';

  const embed = new EmbedBuilder()
    .setTitle('Persona System Status')
    .setColor(s.enabled ? 0x00cc66 : 0xcc3300)
    .addFields(
      { name: 'Enabled', value: s.enabled ? '✅ Yes' : '❌ No', inline: true },
      { name: 'Channel Cooldown', value: `${s.replyCooldownMinutes} min`, inline: true },
      { name: 'Player Cooldown', value: `${s.playerCooldownMinutes} min`, inline: true },
      { name: 'Mapped Persona Channels', value: gameLines, inline: false },
      { name: 'Note', value: 'Serious keyword guard always runs first and always wins.', inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
