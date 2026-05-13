const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

const SETTINGS_PATH = path.join(process.cwd(), 'src', 'storage', 'data', 'ambientSettings.json');

const DEFAULTS = {
  ambientEnabled: false,
  ambientCooldownMinutes: 240,
};

let settings = { ...DEFAULTS };

function init() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      settings.ambientEnabled =
        typeof parsed.ambientEnabled === 'boolean'
          ? parsed.ambientEnabled
          : DEFAULTS.ambientEnabled;
      settings.ambientCooldownMinutes =
        typeof parsed.ambientCooldownMinutes === 'number' &&
        parsed.ambientCooldownMinutes >= 30 &&
        parsed.ambientCooldownMinutes <= 1440
          ? parsed.ambientCooldownMinutes
          : DEFAULTS.ambientCooldownMinutes;
      logger.info(`Ambient settings loaded — enabled: ${settings.ambientEnabled}, cooldown: ${settings.ambientCooldownMinutes}min`);
    } else {
      settings = { ...DEFAULTS };
      persist();
      logger.info('Ambient settings initialized with defaults');
    }
  } catch (err) {
    logger.warn(`Failed to load ambient settings: ${err.message}. Using defaults.`);
    settings = { ...DEFAULTS };
  }
}

function persist() {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    logger.error(`Failed to persist ambient settings: ${err.message}`);
  }
}

function getSettings() {
  return { ...settings };
}

function isEnabled() {
  return settings.ambientEnabled;
}

function getCooldownMinutes() {
  return settings.ambientCooldownMinutes;
}

function setEnabled(val) {
  settings.ambientEnabled = !!val;
  persist();
}

function setCooldownMinutes(minutes) {
  const clamped = Math.max(30, Math.min(1440, minutes));
  settings.ambientCooldownMinutes = clamped;
  persist();
}

module.exports = { init, getSettings, isEnabled, getCooldownMinutes, setEnabled, setCooldownMinutes };
