const { getCaseSummary } = require('./caseSummaryService');

const TYPE_LABELS = {
  reports: 'Report',
  incidents: 'Incident',
  warnings: 'Warning',
  watchlist: 'Watchlist',
};

function fmt(val) {
  return val || '—';
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
}

async function generateMarkdown(recordId) {
  const result = await getCaseSummary(recordId);
  if (result.error) return { error: result.error };

  const { type, record, linkedIncident, linkedReports, action } = result;
  const label = TYPE_LABELS[type] || 'Record';
  const lines = [];

  lines.push(`# Case Export: ${record.id}`);
  lines.push('');
  lines.push(`**Type:** ${label}`);
  lines.push(`**Status:** ${record.status}`);
  lines.push(`**Game:** ${fmt(record.game)}`);
  if (record.severity) lines.push(`**Severity:** ${record.severity}`);
  lines.push(`**Created At:** ${fmtDate(record.createdAt)}`);
  if (record.createdBy) lines.push(`**Created By:** User ID ${record.createdBy}`);

  lines.push('');
  lines.push('## Player Information');
  lines.push('');

  if (type === 'reports') {
    lines.push(`**Reported Player:** ${record.reportedPlayer}`);
    if (record.reporterTag) lines.push(`**Reporter:** ${record.reporterTag}`);
    if (record.reporterId) lines.push(`**Reporter ID:** ${record.reporterId}`);
  } else {
    lines.push(`**Player:** ${record.player}`);
  }

  lines.push('');
  lines.push('## Details');
  lines.push('');

  if (type === 'reports' && record.issue) {
    lines.push('**Issue:**');
    lines.push(record.issue);
    lines.push('');
  } else if (type === 'incidents') {
    if (record.type) { lines.push(`**Type:** ${record.type}`); }
    if (record.note) {
      lines.push('**Note:**');
      lines.push(record.note);
      lines.push('');
    }
  } else if ((type === 'warnings' || type === 'watchlist') && record.reason) {
    lines.push('**Reason:**');
    lines.push(record.reason);
    lines.push('');
  }

  if (record.evidence) {
    lines.push('**Evidence:**');
    lines.push(record.evidence);
    lines.push('');
  }

  if (type === 'reports' && record.linkedIncidentId) {
    lines.push('## Linked Incident');
    lines.push('');
    lines.push(`**Incident ID:** ${record.linkedIncidentId}`);
    if (linkedIncident) {
      lines.push(`**Player:** ${linkedIncident.player}`);
      lines.push(`**Status:** ${linkedIncident.status}`);
      lines.push(`**Severity:** ${fmt(linkedIncident.severity)}`);
      lines.push(`**Summary:** ${linkedIncident.note || linkedIncident.type || '—'}`);
    }
    lines.push('');
  }

  if (type === 'incidents' && linkedReports.length > 0) {
    lines.push(`## Linked Reports (${linkedReports.length})`);
    lines.push('');
    for (const r of linkedReports) {
      lines.push(`- ${r.id} — ${r.reportedPlayer} — ${r.status}`);
    }
    lines.push('');
  }

  if (record.status === 'Resolved' || record.status === 'Removed' ||
      record.outcome || record.resolution) {
    lines.push('## Resolution Details');
    lines.push('');
    if (record.outcome) lines.push(`**Outcome:** ${record.outcome}`);
    if (record.resolution) lines.push(`**Resolution:** ${record.resolution}`);
    if (record.resolvedAt) lines.push(`**Resolved At:** ${fmtDate(record.resolvedAt)}`);
    if (record.resolvedBy) lines.push(`**Resolved By:** User ID ${record.resolvedBy}`);
    if (record.reviewedAt) lines.push(`**Reviewed At:** ${fmtDate(record.reviewedAt)}`);
    if (record.reviewedBy) lines.push(`**Reviewed By:** User ID ${record.reviewedBy}`);
    if (record.removedAt) lines.push(`**Removed At:** ${fmtDate(record.removedAt)}`);
    if (record.removedBy) lines.push(`**Removed By:** User ID ${record.removedBy}`);
    if (record.removalReason) lines.push(`**Removal Reason:** ${record.removalReason}`);
    lines.push('');
  }

  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(action);

  return { markdown: lines.join('\n'), filename: `${record.id.toLowerCase()}.md` };
}

module.exports = { generateMarkdown };
