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

module.exports = {
  addReport,
  getAllReports,
};
