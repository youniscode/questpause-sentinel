const store = require('../../storage/storeInterface');
const logger = require('../../utils/logger');

async function generateReportId() {
  const all = await getAllReports();
  const num = (all?.length || 0) + 1;
  return `QP-REP-${String(num).padStart(4, '0')}`;
}

async function getAllReports() {
  return store.read('reports');
}

async function addReport({ reportedPlayer, reporterId, reporterTag, game, issue, evidence }) {
  const report = {
    id: await generateReportId(),
    reportedPlayer,
    reporterId,
    reporterTag,
    game,
    issue,
    evidence: evidence || null,
    status: 'Open',
    createdAt: new Date().toISOString(),
    reviewedBy: null,
    reviewedAt: null,
    linkedIncidentId: null,
  };

  try {
    await store.addItem('reports', report);
    logger.info(`Report filed: ${report.id} — ${game}`);
    return report;
  } catch (err) {
    logger.error(`Failed to save report: ${err.message}`);
    return null;
  }
}

async function resolveReport(reportId, outcome, resolution, reviewedBy, linkedIncidentId) {
  const all = await getAllReports();
  if (!all) return { error: 'not_found' };

  const idx = all.findIndex((r) => r.id.toLowerCase() === reportId.toLowerCase());
  if (idx === -1) return { error: 'not_found' };

  const report = all[idx];
  if (report.status !== 'Open') return { error: 'already_resolved', report };

  report.status = 'Resolved';
  report.outcome = outcome;
  report.resolution = resolution;
  report.reviewedBy = reviewedBy;
  report.reviewedAt = new Date().toISOString();
  report.linkedIncidentId = linkedIncidentId || null;

  await store.write('reports', all);
  logger.info(`Report resolved: ${report.id} — outcome: ${outcome}`);
  return { error: null, report };
}

module.exports = {
  addReport,
  getAllReports,
  resolveReport,
};
