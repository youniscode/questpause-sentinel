const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const reportLogger = require('../modules/moderation/reportLogger');
const logger = require('../utils/logger');

const outcomes = [
  'No Action',
  'Duplicate',
  'Evidence Insufficient',
  'Resolved Informally',
  'Warning Issued',
  'Converted To Incident',
];

const data = new SlashCommandBuilder()
  .setName('resolve-report')
  .setDescription('[Admin] Resolve an open player report')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Report ID (e.g. QP-REP-0001)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('outcome').setDescription('Resolution outcome')
      .setRequired(true)
      .addChoices(...outcomes.map((o) => ({ name: o, value: o }))),
  )
  .addStringOption((opt) =>
    opt.setName('resolution').setDescription('Resolution notes').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('linked-incident-id').setDescription('Linked incident ID (optional)').setRequired(false),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const reportId = interaction.options.getString('id').trim();
  const outcome = interaction.options.getString('outcome');
  const resolution = interaction.options.getString('resolution').trim();
  const linkedIncidentId = interaction.options.getString('linked-incident-id')?.trim() || null;

  const result = await reportLogger.resolveReport(reportId, outcome, resolution, interaction.user.id, linkedIncidentId);

  if (result.error === 'not_found') {
    await interaction.editReply({ content: `No report found with ID \`${reportId}\`.` });
    return;
  }

  if (result.error === 'already_resolved') {
    await interaction.editReply({ content: `Report \`${reportId}\` is already resolved.` });
    return;
  }

  const rep = result.report;
  logger.info(`Report ${reportId} resolved by ${interaction.user.tag} — outcome: ${outcome}`);

  const embed = new EmbedBuilder()
    .setTitle('Report Resolved')
    .setColor(0x00cc66)
    .addFields(
      { name: 'Report ID', value: `\`${rep.id}\``, inline: true },
      { name: 'Reported Player', value: rep.reportedPlayer, inline: true },
      { name: 'Game', value: rep.game, inline: true },
      { name: 'Previous Status', value: 'Open', inline: true },
      { name: 'New Status', value: rep.status, inline: true },
      { name: 'Outcome', value: rep.outcome, inline: true },
      { name: 'Reviewed By', value: `<@${rep.reviewedBy}>`, inline: true },
      { name: 'Reviewed At', value: new Date(rep.reviewedAt).toUTCString(), inline: false },
      ...(rep.linkedIncidentId
        ? [{ name: 'Linked Incident ID', value: `\`${rep.linkedIncidentId}\``, inline: false }]
        : []),
      { name: 'Resolution', value: rep.resolution.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
