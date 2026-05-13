const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const store = require('../storage/storeInterface');
const { linkReportToIncident } = require('../modules/moderation/reportLogger');

const data = new SlashCommandBuilder()
  .setName('link-report-incident')
  .setDescription('Link an existing report to an existing incident')
  .addStringOption((opt) =>
    opt.setName('report-id').setDescription('Report ID (e.g. QP-REP-0001)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('incident-id').setDescription('Incident ID (e.g. QP-INC-0001)').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const reportId = interaction.options.getString('report-id').trim();
  const incidentId = interaction.options.getString('incident-id').trim();

  const incidents = (await store.read('incidents')) || [];
  const incident = incidents.find(
    (i) => i.id.toLowerCase() === incidentId.toLowerCase(),
  );
  if (!incident) {
    await interaction.editReply({
      content: `Incident \`${incidentId}\` not found.`,
    });
    return;
  }

  const result = await linkReportToIncident(reportId, incidentId, interaction.user.id);
  if (result.error === 'not_found' || result.error === 'report_not_found') {
    await interaction.editReply({
      content: `Report \`${reportId}\` not found.`,
    });
    return;
  }

  const report = result.report;

  const embed = {
    color: 0x0099ff,
    title: 'Report Linked to Incident',
    fields: [
      { name: 'Report ID', value: report.id, inline: true },
      { name: 'Incident ID', value: incident.id, inline: true },
      { name: 'Reported Player', value: report.reportedPlayer, inline: true },
      { name: 'Incident Player', value: incident.player, inline: true },
      { name: 'Game', value: report.game || '—', inline: true },
      { name: 'Linked By', value: `<@${interaction.user.id}>`, inline: true },
      { name: 'Linked At', value: new Date(report.linkedAt).toISOString(), inline: false },
    ],
    timestamp: new Date().toISOString(),
  };

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
