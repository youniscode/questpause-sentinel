function parseIds(envValue) {
  if (!envValue || !envValue.trim()) return [];
  return envValue.split(',').map((s) => s.trim()).filter(Boolean);
}

const provider = process.env.AI_PROVIDER || '';
const model = process.env.AI_MODEL || '';
const apiKey = process.env.AI_API_KEY || '';
const maxResponseChars = parseInt(process.env.AI_MAX_RESPONSE_CHARS, 10) || 1200;
const cooldownSeconds = parseInt(process.env.AI_COOLDOWN_SECONDS, 10) || 20;
const channelIds = new Set(parseIds(process.env.SENTINEL_AI_CHANNEL_IDS));

module.exports = { provider, model, apiKey, maxResponseChars, cooldownSeconds, channelIds };
