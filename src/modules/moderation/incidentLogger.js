const store = require('../../storage/storeInterface');
const logger = require('../../utils/logger');

async function generateIncidentId() {
  const all = await getAllIncidents();
  const num = (all?.length || 0) + 1;
  return `QP-INC-${String(num).padStart(4, '0')}`;
}

function sanitize(text) {
  if (typeof text !== 'string') return '';
  return text.trim();
}

async function logIncident({ player, game, type, severity, note, evidence, createdBy }) {
  const incident = {
    id: await generateIncidentId(),
    player: sanitize(player),
    game,
    type: sanitize(type),
    severity,
    note: sanitize(note),
    evidence: evidence ? sanitize(evidence) : null,
    status: 'Open',
    createdBy,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolution: null,
    resolvedBy: null,
  };

  try {
    await store.addItem('incidents', incident);
    logger.info(`Incident logged: ${incident.id} — ${type} — ${game}`);
    return incident;
  } catch (err) {
    logger.error(`Failed to log incident: ${err.message}`);
    return null;
  }
}

async function getIncidentById(incidentId) {
  return store.getById('incidents', incidentId);
}

async function getOpenIncidents() {
  const all = await store.read('incidents');
  if (!all) return [];
  return all.filter((inc) => inc.status === 'Open');
}

async function getAllIncidents() {
  return store.read('incidents');
}

module.exports = {
  logIncident,
  getIncidentById,
  getOpenIncidents,
  getAllIncidents,
};
