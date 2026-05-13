const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getCaseSummary } = require('../modules/moderation/caseSummaryService');

const TYPE_EMOJIS = {
  reports: '📋',
  incidents: '🚨',
  warnings: '⚠️',
  watchlist: '👁️',
};

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const data = new SlashCommandBuilder()
  .setName('case-summary')
  .setDescription('View a full summary of any moderation record by ID')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Record ID (e.g. QP-REP-0001, QP-INC-0001, QP-WARN-0001, QP-WATCH-0001)').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const rawId = interaction.options.getString('id').trim();
  const result = await getCaseSummary(rawId);

  if (result.error) {
    await interaction.editReply({ content: result.error });
    return;
  }

  const { type, record, linkedIncident, linkedReports, action } = result;
  const emoji = TYPE_EMOJIS[type] || '📄';
  const typeLabel = type.slice(0, -1).replace(/^\w/, (c) => c.toUpperCase());

  const statusColor = (record.status || '').toLowerCase() === 'open' || (record.status || '').toLowerCase() === 'active'
    ? 0xffaa00
    : 0x00ff88;

  const fields = [];

  const basicInfo = [
    `**ID:** ${record.id}`,
    `**Type:** ${emoji} ${typeLabel}`,
    `**Status:** ${record.status}`,
    `**Game:** ${record.game || '—'}`,
    record.severity ? `**Severity:** ${record.severity}` : null,
    `**Created:** ${formatDate(record.createdAt)}`,
  ].filter(Boolean);

  if (type === 'reports') {
    basicInfo.push(`**Reported Player:** ${record.reportedPlayer}`);
    if (record.reporterTag) basicInfo.push(`**Reporter:** ${record.reporterTag}`);
  } else {
    basicInfo.push(`**Player:** ${record.player}`);
  }

  if (record.createdBy) {
    basicInfo.push(`**Created By:** <@${record.createdBy}>`);
  }

  fields.push({ name: 'Record Info', value: basicInfo.join('\n') });

  if (type === 'reports' && record.issue) {
    fields.push({ name: 'Issue', value: record.issue });
  } else if (type === 'incidents' && record.note) {
    fields.push({ name: 'Note', value: record.note });
  } else if ((type === 'warnings' || type === 'watchlist') && record.reason) {
    fields.push({ name: 'Reason', value: record.reason });
  }

  if (record.evidence) {
    fields.push({ name: 'Evidence', value: record.evidence });
  }

  const resolvedFields = [];
  if (record.resolution) resolvedFields.push(`**Resolution:** ${record.resolution}`);
  if (record.outcome) resolvedFields.push(`**Outcome:** ${record.outcome}`);
  if (record.resolvedAt) resolvedFields.push(`**Resolved At:** ${formatDate(record.resolvedAt)}`);
  if (record.resolvedBy) resolvedFields.push(`**Resolved By:** <@${record.resolvedBy}>`);
  if (record.reviewedAt) resolvedFields.push(`**Reviewed At:** ${formatDate(record.reviewedAt)}`);
  if (record.reviewedBy) resolvedFields.push(`**Reviewed By:** <@${record.reviewedBy}>`);
  if (record.removedAt) resolvedFields.push(`**Removed At:** ${formatDate(record.removedAt)}`);
  if (record.removedBy) resolvedFields.push(`**Removed By:** <@${record.removedBy}>`);
  if (record.removalReason) resolvedFields.push(`**Removal Reason:** ${record.removalReason}`);

  if (resolvedFields.length > 0) {
    fields.push({ name: `${record.status} Details`, value: resolvedFields.join('\n') });
  }

  if (linkedIncident) {
    fields.push({
      name: 'Linked Incident',
      value: [
        `**ID:** ${linkedIncident.id}`,
        `**Player:** ${linkedIncident.player}`,
        `**Status:** ${linkedIncident.status}`,
        `**Severity:** ${linkedIncident.severity || '—'}`,
        `**Summary:** ${linkedIncident.note || linkedIncident.type || '—'}`,
      ].join('\n'),
    });
  }

  if (linkedReports.length > 0) {
    const reportLines = linkedReports.slice(0, 5).map((r) => {
      return `\`${r.id}\` — ${r.reportedPlayer} — ${r.status}`;
    });
    fields.push({
      name: `Linked Reports (${linkedReports.length})`,
      value: reportLines.join('\n'),
    });
  }

  fields.push({
    name: 'Recommended Next Action',
    value: action,
  });

  const embed = {
    color: statusColor,
    title: `${emoji} ${typeLabel} Summary`,
    fields,
    timestamp: new Date().toISOString(),
  };

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
