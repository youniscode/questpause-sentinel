const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

const SETTINGS_FILE = path.join(process.cwd(), 'src', 'storage', 'data', 'personaSettings.json');

let settings = {
  enabled: true,
  replyCooldownMinutes: 15,
  playerCooldownMinutes: 30,
};

function loadDefaults() {
  const envEnabled = process.env.ENABLE_PERSONA_REPLIES;
  settings.enabled = envEnabled ? envEnabled.toLowerCase() === 'true' : true;
  settings.replyCooldownMinutes = parseInt(process.env.PERSONA_REPLY_COOLDOWN_MINUTES, 10) || 15;
  settings.playerCooldownMinutes = parseInt(process.env.PERSONA_PLAYER_COOLDOWN_MINUTES, 10) || 30;
}

function persist() {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    logger.error(`Failed to persist persona settings: ${err.message}`);
  }
}

function init() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      settings.enabled = typeof parsed.enabled === 'boolean' ? parsed.enabled : true;
      settings.replyCooldownMinutes = typeof parsed.replyCooldownMinutes === 'number' ? parsed.replyCooldownMinutes : 15;
      settings.playerCooldownMinutes = typeof parsed.playerCooldownMinutes === 'number' ? parsed.playerCooldownMinutes : 30;
      logger.info('Persona settings loaded from personaSettings.json');
    } else {
      loadDefaults();
      persist();
      logger.info('Persona settings initialized from .env defaults');
    }
  } catch (err) {
    logger.error(`Failed to load persona settings: ${err.message}. Falling back to .env defaults.`);
    loadDefaults();
  }
}

function getSettings() {
  return { ...settings };
}

function setEnabled(val) {
  settings.enabled = !!val;
  persist();
}

function setCooldowns(replyMin, playerMin) {
  settings.replyCooldownMinutes = replyMin;
  settings.playerCooldownMinutes = playerMin;
  persist();
}

module.exports = { init, getSettings, setEnabled, setCooldowns };
