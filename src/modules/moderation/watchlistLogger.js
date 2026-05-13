const store = require('../../storage/storeInterface');
const logger = require('../../utils/logger');

async function generateWatchId() {
  const all = await getAllWatchlist();
  const num = (all?.length || 0) + 1;
  return `QP-WATCH-${String(num).padStart(4, '0')}`;
}

async function getAllWatchlist() {
  return store.read('watchlist');
}

async function addWatch({ player, game, reason, severity, createdBy }) {
  const entry = {
    id: await generateWatchId(),
    player,
    game,
    reason,
    severity,
    status: 'Active',
    createdBy,
    createdAt: new Date().toISOString(),
    removedBy: null,
    removedAt: null,
    removalReason: null,
  };

  try {
    await store.addItem('watchlist', entry);
    logger.info(`Watch added: ${entry.id} — ${player} — ${game}`);
    return entry;
  } catch (err) {
    logger.error(`Failed to add watch: ${err.message}`);
    return null;
  }
}

async function removeWatch(watchId, removedBy, removalReason) {
  const all = await getAllWatchlist();
  if (!all) return { error: 'not_found' };

  const idx = all.findIndex((w) => w.id.toLowerCase() === watchId.toLowerCase());
  if (idx === -1) return { error: 'not_found' };

  const entry = all[idx];
  if (entry.status !== 'Active') return { error: 'already_removed', entry };

  entry.status = 'Removed';
  entry.removedBy = removedBy;
  entry.removedAt = new Date().toISOString();
  entry.removalReason = removalReason;

  await store.write('watchlist', all);
  logger.info(`Watch removed: ${entry.id} — ${entry.player}`);
  return { error: null, entry };
}

module.exports = {
  addWatch,
  removeWatch,
  getAllWatchlist,
};
