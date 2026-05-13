const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const incidentLogger = require('../modules/moderation/incidentLogger');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('resolve-incident')
  .setDescription('[Admin] Resolve an open incident')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Incident ID (e.g. QP-INC-0001)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('resolution').setDescription('Resolution notes').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const incidentId = interaction.options.getString('id').trim();
  const resolution = interaction.options.getString('resolution').trim();

  const result = await incidentLogger.resolveIncident(incidentId, resolution, interaction.user.id);

  if (result.error === 'not_found') {
    await interaction.editReply({ content: `No incident found with ID \`${incidentId}\`.` });
    return;
  }

  if (result.error === 'already_resolved') {
    await interaction.editReply({ content: `Incident \`${incidentId}\` is already resolved.` });
    return;
  }

  const inc = result.incident;
  logger.info(`Incident ${incidentId} resolved by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Incident Resolved')
    .setColor(0x00cc66)
    .addFields(
      { name: 'Incident ID', value: `\`${inc.id}\``, inline: true },
      { name: 'Player', value: inc.player, inline: true },
      { name: 'Game', value: inc.game, inline: true },
      { name: 'Type', value: inc.type, inline: true },
      { name: 'Severity', value: inc.severity, inline: true },
      { name: 'Previous Status', value: 'Open', inline: true },
      { name: 'New Status', value: inc.status, inline: true },
      { name: 'Resolved By', value: `<@${inc.resolvedBy}>`, inline: true },
      { name: 'Resolved At', value: new Date(inc.resolvedAt).toUTCString(), inline: false },
      { name: 'Resolution', value: inc.resolution.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
