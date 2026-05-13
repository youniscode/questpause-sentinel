function parseIds(envValue) {
  if (!envValue || !envValue.trim()) return new Set();
  return new Set(envValue.split(',').map((s) => s.trim()).filter(Boolean));
}

const monitoredChannelIds = parseIds(process.env.SENTINEL_MONITORED_CHANNEL_IDS);
const blockedChannelIds = parseIds(process.env.SENTINEL_BLOCKED_CHANNEL_IDS);
const blockedCategoryIds = parseIds(process.env.SENTINEL_BLOCKED_CATEGORY_IDS);

module.exports = {
  monitoredChannelIds,
  blockedChannelIds,
  blockedCategoryIds,
};
