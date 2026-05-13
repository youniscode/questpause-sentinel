const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

const SETTINGS_PATH = path.join(process.cwd(), 'src', 'storage', 'data', 'aiSettings.json');

let aiEnabled = false;

function init() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      aiEnabled = typeof parsed.aiEnabled === 'boolean' ? parsed.aiEnabled : (process.env.AI_SENTINEL_ENABLED === 'true');
    } else {
      aiEnabled = process.env.AI_SENTINEL_ENABLED === 'true';
      persist();
    }
    logger.info(`AI settings loaded — enabled: ${aiEnabled}`);
  } catch (err) {
    logger.warn(`Failed to load AI settings: ${err.message}. Using env default.`);
    aiEnabled = process.env.AI_SENTINEL_ENABLED === 'true';
  }
}

function persist() {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ aiEnabled }, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Failed to persist AI settings: ${err.message}`);
  }
}

function isEnabled() {
  return aiEnabled;
}

function setEnabled(val) {
  aiEnabled = !!val;
  persist();
}

module.exports = { init, isEnabled, setEnabled };
