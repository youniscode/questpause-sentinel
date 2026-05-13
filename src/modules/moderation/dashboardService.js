const store = require('../../storage/storeInterface');

async function getDashboardData() {
  const incidents = (await store.read('incidents')) || [];
  const reports = (await store.read('reports')) || [];
  const warnings = (await store.read('warnings')) || [];
  const watchlist = (await store.read('watchlist')) || [];

  const openIncidents = incidents.filter((i) => i.status === 'Open');
  const resolvedIncidents = incidents.filter((i) => i.status === 'Resolved');
  const openReports = reports.filter((r) => r.status === 'Open');
  const resolvedReports = reports.filter((r) => r.status === 'Resolved');
  const activeWarnings = warnings.filter((w) => w.status === 'Active');
  const resolvedWarnings = warnings.filter((w) => w.status === 'Resolved');
  const activeWatchlist = watchlist.filter((w) => w.status === 'Active');
  const removedWatchlist = watchlist.filter((w) => w.status === 'Removed');

  const stats = {
    openIncidents: openIncidents.length,
    resolvedIncidents: resolvedIncidents.length,
    openReports: openReports.length,
    resolvedReports: resolvedReports.length,
    activeWarnings: activeWarnings.length,
    resolvedWarnings: resolvedWarnings.length,
    activeWatchlist: activeWatchlist.length,
    removedWatchlist: removedWatchlist.length,
  };

  const openItems = [
    ...openIncidents.map((i) => ({
      type: 'Incident',
      id: i.id,
      player: i.player,
      game: i.game,
      severity: i.severity || null,
      createdAt: i.createdAt,
      summary: i.note || i.type || '',
    })),
    ...openReports.map((r) => ({
      type: 'Report',
      id: r.id,
      player: r.reportedPlayer,
      game: r.game,
      severity: null,
      createdAt: r.createdAt,
      summary: r.issue || '',
    })),
    ...activeWarnings.map((w) => ({
      type: 'Warning',
      id: w.id,
      player: w.player,
      game: w.game,
      severity: w.severity || null,
      createdAt: w.createdAt,
      summary: w.reason || '',
    })),
    ...activeWatchlist.map((w) => ({
      type: 'Watchlist',
      id: w.id,
      player: w.player,
      game: w.game,
      severity: w.severity || null,
      createdAt: w.createdAt,
      summary: w.reason || '',
    })),
  ];

  openItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const latestOpen = openItems.slice(0, 5);

  return { stats, latestOpen };
}

function truncate(text, maxLen = 80) {
  if (!text || typeof text !== 'string') return '—';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = { getDashboardData, truncate, formatDate };
