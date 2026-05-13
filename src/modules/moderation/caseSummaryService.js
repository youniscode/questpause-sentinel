const store = require('../../storage/storeInterface');

const PREFIX_MAP = {
  'QP-REP': 'reports',
  'QP-INC': 'incidents',
  'QP-WARN': 'warnings',
  'QP-WATCH': 'watchlist',
};

function detectType(recordId) {
  const upper = recordId.toUpperCase();
  for (const [prefix, type] of Object.entries(PREFIX_MAP)) {
    if (upper.startsWith(prefix)) return type;
  }
  return null;
}

function getRecommendedAction(record) {
  const status = (record.status || '').toLowerCase();
  const type = detectType(record.id);

  if (status === 'open') {
    if (type === 'reports') {
      return 'Review evidence, link to incident if needed, then resolve report.';
    }
    if (type === 'incidents') {
      return 'Investigate, add warning or watchlist if needed, resolve when done.';
    }
  }

  if (status === 'active') {
    if (type === 'warnings') {
      return 'Monitor player behavior or resolve warning if addressed.';
    }
    if (type === 'watchlist') {
      return 'Monitor player activity or unwatch if no longer a concern.';
    }
  }

  if (status === 'resolved' || status === 'removed') {
    return 'No open action required.';
  }

  return 'Review record and take appropriate action.';
}

async function getCaseSummary(recordId) {
  const type = detectType(recordId);
  if (!type) return { error: `Unknown record type. ID must start with QP-REP, QP-INC, QP-WARN, or QP-WATCH.` };

  const collection = await store.read(type);
  if (!collection) return { error: `No ${type} records found.` };

  const record = collection.find(
    (r) => r.id.toLowerCase() === recordId.toLowerCase(),
  );
  if (!record) return { error: `${type.slice(0, -1)} \`${recordId}\` not found.` };

  let linkedIncident = null;
  let linkedReports = [];

  if (type === 'reports' && record.linkedIncidentId) {
    const incidents = await store.read('incidents');
    if (incidents) {
      linkedIncident = incidents.find(
        (i) => i.id.toLowerCase() === record.linkedIncidentId.toLowerCase(),
      );
    }
  }

  if (type === 'incidents') {
    const reports = await store.read('reports');
    if (reports) {
      linkedReports = reports.filter(
        (r) => r.linkedIncidentId && r.linkedIncidentId.toLowerCase() === recordId.toLowerCase(),
      );
    }
  }

  const action = getRecommendedAction(record);

  return { type, record, linkedIncident, linkedReports, action };
}

module.exports = { getCaseSummary };
