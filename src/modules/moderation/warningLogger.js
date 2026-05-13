const store = require('../../storage/storeInterface');
const logger = require('../../utils/logger');

async function generateWarningId() {
  const all = await getAllWarnings();
  const num = (all?.length || 0) + 1;
  return `QP-WARN-${String(num).padStart(4, '0')}`;
}

function sanitize(text) {
  if (typeof text !== 'string') return '';
  return text.trim();
}

async function addWarning({ player, game, severity, reason, createdBy }) {
  const warning = {
    id: await generateWarningId(),
    player: sanitize(player),
    game,
    severity,
    reason: sanitize(reason),
    status: 'Active',
    createdBy,
    createdAt: new Date().toISOString(),
  };

  try {
    await store.addItem('warnings', warning);
    logger.info(`Warning issued: ${warning.id} — ${game} — ${severity}`);
    return warning;
  } catch (err) {
    logger.error(`Failed to add warning: ${err.message}`);
    return null;
  }
}

async function getAllWarnings() {
  return store.read('warnings');
}

async function getPlayerWarnings(playerQuery) {
  const all = await getAllWarnings();
  if (!all) return [];
  return all.filter((w) => w.player.toLowerCase().includes(playerQuery));
}

async function getActiveWarnings() {
  const all = await getAllWarnings();
  if (!all) return [];
  return all.filter((w) => w.status === 'Active');
}

module.exports = {
  addWarning,
  getAllWarnings,
  getPlayerWarnings,
  getActiveWarnings,
};
