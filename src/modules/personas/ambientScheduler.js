const logger = require('../../utils/logger');
const channelGames = require('../../config/channelGames');
const channelConfig = require('../../config/channels');
const ambientSettings = require('./ambientSettings');
const ambientState = require('./ambientState');
const ambientMessages = require('./ambientMessages');

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
let intervalHandle = null;
let client = null;

function getAlertAndReportChannelIds() {
  const ids = [];
  if (process.env.SENTINEL_ALERT_CHANNEL_ID) {
    ids.push(process.env.SENTINEL_ALERT_CHANNEL_ID);
  }
  if (process.env.SENTINEL_REPORT_CHANNEL_ID) {
    ids.push(process.env.SENTINEL_REPORT_CHANNEL_ID);
  }
  return ids;
}

function isChannelAllowed(channelId) {
  const blocked = getAlertAndReportChannelIds();
  if (blocked.includes(channelId)) return false;
  if (channelConfig.blockedChannelIds.has(channelId)) return false;
  return true;
}

async function tryPost(guild, channelId) {
  if (!isChannelAllowed(channelId)) return;

  const game = channelGames.channelToGame.get(channelId);
  if (!game) return;

  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return;

  if (channelConfig.monitoredChannelIds.size > 0 && !channelConfig.monitoredChannelIds.has(channelId)) return;

  if (channel.parentId && channelConfig.blockedCategoryIds.has(channel.parentId)) return;

  const cooldownMs = ambientSettings.getCooldownMinutes() * 60 * 1000;
  if (!ambientState.canPost(channelId, cooldownMs)) return;

  const message = ambientMessages.pickMessage(game);
  if (!message) return;

  const persona = ambientMessages.getPersonaForGame(game);
  const prefix = persona ? `${persona.emoji} **${persona.name}**` : '';

  try {
    await channel.send(prefix ? `${prefix}\n${message}` : message);
    ambientState.markPosted(channelId);
    logger.info(`Ambient message posted in #${channel.name} (${channelId}) for ${game}`);
  } catch (err) {
    logger.warn(`Failed to post ambient message in ${channelId}: ${err.message}`);
  }
}

async function tick() {
  if (!ambientSettings.isEnabled()) return;
  if (!client) return;

  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) return;

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  for (const [channelId] of channelGames.channelToGame) {
    try {
      await tryPost(guild, channelId);
    } catch (err) {
      logger.warn(`Ambient scheduler error on channel ${channelId}: ${err.message}`);
    }
  }
}

function start(c) {
  client = c;
  if (intervalHandle) return;
  logger.info(`Ambient scheduler started (check interval: ${CHECK_INTERVAL_MS / 1000}s)`);
  intervalHandle = setInterval(tick, CHECK_INTERVAL_MS);
  tick();
}

function stop() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    client = null;
    logger.info('Ambient scheduler stopped');
  }
}

module.exports = { start, stop };
