const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

const STATE_PATH = path.join(process.cwd(), 'src', 'storage', 'data', 'ambientState.json');

let lastPostedAt = {};

function init() {
  try {
    if (fs.existsSync(STATE_PATH)) {
      const raw = fs.readFileSync(STATE_PATH, 'utf8');
      lastPostedAt = JSON.parse(raw);
      logger.info(`Ambient state loaded — ${Object.keys(lastPostedAt).length} channel(s) tracked`);
    } else {
      lastPostedAt = {};
      persist();
      logger.info('Ambient state initialized empty');
    }
  } catch (err) {
    logger.warn(`Failed to load ambient state: ${err.message}. Starting fresh.`);
    lastPostedAt = {};
  }
}

function persist() {
  try {
    const dir = path.dirname(STATE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATE_PATH, JSON.stringify(lastPostedAt, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Failed to persist ambient state: ${err.message}`);
  }
}

function canPost(channelId, cooldownMs) {
  const last = lastPostedAt[channelId];
  if (!last) return true;
  return Date.now() - last >= cooldownMs;
}

function markPosted(channelId) {
  lastPostedAt[channelId] = Date.now();
  persist();
}

function getTimeUntilNext(channelId, cooldownMs) {
  const last = lastPostedAt[channelId];
  if (!last) return 0;
  const elapsed = Date.now() - last;
  if (elapsed >= cooldownMs) return 0;
  return cooldownMs - elapsed;
}

module.exports = { init, canPost, markPosted, getTimeUntilNext };
