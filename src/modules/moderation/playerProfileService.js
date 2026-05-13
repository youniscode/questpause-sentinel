const store = require('../../storage/storeInterface');

async function getPlayerProfile(query) {
  const q = query.toLowerCase().trim();

  const incidents = (await store.read('incidents')) || [];
  const reports = (await store.read('reports')) || [];
  const warnings = (await store.read('warnings')) || [];
  const watchlist = (await store.read('watchlist')) || [];

  const incMatches = incidents.filter((i) => i.player.toLowerCase().includes(q));
  const repMatches = reports.filter(
    (r) => r.reportedPlayer.toLowerCase().includes(q),
  );
  const warnMatches = warnings.filter((w) => w.player.toLowerCase().includes(q));
  const watchMatches = watchlist.filter((w) => w.player.toLowerCase().includes(q));

  const totalRecords =
    incMatches.length + repMatches.length + warnMatches.length + watchMatches.length;

  if (totalRecords === 0) {
    return { found: false, playerName: query.trim() };
  }

  const openInc = incMatches.filter((i) => i.status === 'Open');
  const resolvedInc = incMatches.filter((i) => i.status === 'Resolved');
  const openRep = repMatches.filter((r) => r.status === 'Open');
  const resolvedRep = repMatches.filter((r) => r.status === 'Resolved');
  const activeWarn = warnMatches.filter((w) => w.status === 'Active');
  const resolvedWarn = warnMatches.filter((w) => w.status === 'Resolved');
  const activeWatch = watchMatches.filter((w) => w.status === 'Active');
  const removedWatch = watchMatches.filter((w) => w.status === 'Removed');

  const criticalCount = [...incMatches, ...warnMatches, ...watchMatches].filter(
    (item) => item.severity && item.severity.toLowerCase() === 'critical',
  ).length;

  const totalOpen = openInc.length + openRep.length + activeWarn.length + activeWatch.length;

  let signal = 'Calm';
  if (criticalCount > 0 || totalOpen >= 3) {
    signal = 'High Attention';
  } else if (activeWarn.length > 0 || totalOpen >= 2) {
    signal = 'Caution';
  } else if (openRep.length > 0 || activeWatch.length > 0) {
    signal = 'Monitor';
  }

  const activity = [
    ...incMatches.map((i) => ({
      id: i.id,
      type: 'Incident',
      game: i.game || '—',
      status: i.status,
      severity: i.severity || null,
      createdAt: i.createdAt,
      summary: i.note || i.type || '',
    })),
    ...repMatches.map((r) => ({
      id: r.id,
      type: 'Report',
      game: r.game || '—',
      status: r.status,
      severity: null,
      createdAt: r.createdAt,
      summary: r.issue || '',
    })),
    ...warnMatches.map((w) => ({
      id: w.id,
      type: 'Warning',
      game: w.game || '—',
      status: w.status,
      severity: w.severity || null,
      createdAt: w.createdAt,
      summary: w.reason || '',
    })),
    ...watchMatches.map((w) => ({
      id: w.id,
      type: 'Watchlist',
      game: w.game || '—',
      status: w.status,
      severity: w.severity || null,
      createdAt: w.createdAt,
      summary: w.reason || '',
    })),
  ];

  activity.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const latestActivity = activity.slice(0, 8);

  const stats = {
    totalIncidents: incMatches.length,
    openIncidents: openInc.length,
    resolvedIncidents: resolvedInc.length,
    totalReports: repMatches.length,
    openReports: openRep.length,
    resolvedReports: resolvedRep.length,
    activeWarnings: activeWarn.length,
    resolvedWarnings: resolvedWarn.length,
    activeWatchlist: activeWatch.length,
    removedWatchlist: removedWatch.length,
  };

  return {
    found: true,
    playerName: query.trim(),
    stats,
    signal,
    latestActivity,
  };
}

module.exports = { getPlayerProfile };
