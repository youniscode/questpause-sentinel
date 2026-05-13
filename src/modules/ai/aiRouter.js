const logger = require('../../utils/logger');
const aiConfig = require('../../config/ai');
const aiSettings = require('./aiSettings');
const safetyRouter = require('./safetyRouter');
const aiClient = require('./aiClient');
const systemPrompt = require('./sentinelSystemPrompt');

const userCooldowns = new Map();

function isChannelAllowed(channelId) {
  if (aiConfig.channelIds.size === 0) return false;
  return aiConfig.channelIds.has(channelId);
}

function isOnCooldown(userId) {
  const last = userCooldowns.get(userId);
  if (!last) return false;
  return Date.now() - last < aiConfig.cooldownSeconds * 1000;
}

function setCooldown(userId) {
  userCooldowns.set(userId, Date.now());
}

async function handleMessage(message) {
  if (!aiSettings.isEnabled()) return;
  if (message.author.bot) return;
  if (!isChannelAllowed(message.channel.id)) return;

  if (isOnCooldown(message.author.id)) return;

  const text = message.content.trim();
  if (!text) return;

  if (safetyRouter.containsSeriousKeyword(text)) {
    await message.channel.sendTyping();
    await new Promise((r) => setTimeout(r, 1000));
    await message.reply(safetyRouter.getSafeReply());
    setCooldown(message.author.id);
    logger.info(`AI safety reply sent to ${message.author.tag} in #${message.channel.name}`);
    return;
  }

  let response;
  try {
    response = await aiClient.generateResponse(systemPrompt.prompt, text);
  } catch (err) {
    logger.warn(`AI generateResponse threw for ${message.author.tag}: ${err.message}`);
    return;
  }

  if (!response) {
    logger.info(`AI response skipped for ${message.author.tag} — check provider config or logs`);
    return;
  }

  if (response.length > aiConfig.maxResponseChars) {
    logger.warn(`AI response truncated (${response.length} chars, max ${aiConfig.maxResponseChars})`);
  }

  try {
    await message.channel.sendTyping();
    await new Promise((r) => setTimeout(r, 1500));
    await message.reply(response.slice(0, aiConfig.maxResponseChars));
    setCooldown(message.author.id);
    logger.info(`AI reply sent to ${message.author.tag} in #${message.channel.name}`);
  } catch (err) {
    logger.warn(`Failed to send AI reply: ${err.message}`);
  }
}

module.exports = { handleMessage };
