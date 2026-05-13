const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('../config');

const data = new SlashCommandBuilder()
  .setName('sentinel-status')
  .setDescription('Display Sentinel bot status and stats');

async function execute(interaction) {
  await interaction.deferReply();

  const env = config.environment;
  const envLabel = env.charAt(0).toUpperCase() + env.slice(1);
  const guild =
    interaction.guild ||
    (interaction.guildId
      ? await interaction.client.guilds.fetch(interaction.guildId).catch(() => null)
      : null);

  const guildName = guild?.name || interaction.guildId || 'Unknown';
  const embed = new EmbedBuilder()
    .setTitle('QUESTPAUSE Sentinel - Status')
    .setColor(0x00aaff)
    .addFields(
      { name: 'Bot Status', value: 'Online', inline: true },
      { name: 'Guild', value: guildName, inline: true },
      { name: 'Environment', value: envLabel, inline: true },
      { name: 'Persona System', value: 'Not Loaded', inline: true },
      { name: 'Moderation System', value: 'Not Loaded', inline: true },
      { name: 'Storage', value: 'JSON', inline: true },
      { name: 'Version', value: config.version, inline: true },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
