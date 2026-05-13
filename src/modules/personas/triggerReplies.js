const { KEYWORDS } = require('../../config/keywords');
const { monitoredChannelIds, blockedChannelIds, blockedCategoryIds } = require('../../config/channels');
const { matchTrigger, buildReply } = require('./personaRouter');
const logger = require('../../utils/logger');

const cooldowns = new Map();

async function checkForTrigger(message) {
  if (message.author?.bot) return;
  if (!message.guild) return;
  if (!message.content) return;

  const enabled = process.env.ENABLE_PERSONA_REPLIES;
  if (!enabled || enabled.toLowerCase() !== 'true') return;

  const alertChannelId = process.env.SENTINEL_ALERT_CHANNEL_ID;
  const reportChannelId = process.env.SENTINEL_REPORT_CHANNEL_ID;

  if (message.channel.id === alertChannelId) return;
  if (message.channel.id === reportChannelId) return;
  if (blockedChannelIds.has(message.channel.id)) return;
  if (message.channel.parentId && blockedCategoryIds.has(message.channel.parentId)) return;
  if (monitoredChannelIds.size > 0 && !monitoredChannelIds.has(message.channel.id)) return;

  const content = message.content.toLowerCase();

  for (const serious of KEYWORDS) {
    if (content.includes(serious)) return;
  }

  const match = matchTrigger(content, message.channel.id);
  if (!match) return;

  const replyCooldownMin = parseInt(process.env.PERSONA_REPLY_COOLDOWN_MINUTES, 10) || 15;
  const playerCooldownMin = parseInt(process.env.PERSONA_PLAYER_COOLDOWN_MINUTES, 10) || 30;
  const replyCooldownMs = replyCooldownMin * 60 * 1000;
  const playerCooldownMs = playerCooldownMin * 60 * 1000;

  const channelKey = `persona:ch:${message.channel.id}`;
  const authorKey = `persona:author:${message.author.id}`;

  if (isOnCooldown(channelKey)) return;
  if (isOnCooldown(authorKey)) return;

  setCooldown(channelKey, replyCooldownMs);
  setCooldown(authorKey, playerCooldownMs);

  const reply = buildReply(match.game, match.keyword, match.replies);
  if (!reply) return;

  try {
    await message.channel.send(reply);
    logger.info(`Persona reply sent: [${match.game}] "${match.keyword}" in #${message.channel.name}`);
  } catch (err) {
    logger.error(`Failed to send persona reply: ${err.message}`);
  }
}

function isOnCooldown(key) {
  const expiry = cooldowns.get(key);
  if (!expiry) return false;
  if (Date.now() < expiry) return true;
  cooldowns.delete(key);
  return false;
}

function setCooldown(key, ms) {
  cooldowns.set(key, Date.now() + ms);
}

module.exports = { checkForTrigger };
