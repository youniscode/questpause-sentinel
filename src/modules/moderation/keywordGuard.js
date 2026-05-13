const { EmbedBuilder } = require('discord.js');
const { KEYWORDS, COOLDOWN_MS } = require('../../config/keywords');
const { sendAlert } = require('./alerts');
const logger = require('../../utils/logger');

const cooldowns = new Map();

function getCooldownKey(channelId, keyword) {
  return `ch:${channelId}:kw:${keyword}`;
}

function isOnCooldown(key) {
  const expiry = cooldowns.get(key);
  if (!expiry) return false;
  if (Date.now() < expiry) return true;
  cooldowns.delete(key);
  return false;
}

function setCooldown(key) {
  cooldowns.set(key, Date.now() + COOLDOWN_MS);
}

async function checkMessage(message) {
  if (message.author?.bot) return;
  if (!message.guild) return;
  if (!message.content) return;

  const content = message.content.toLowerCase();
  const alertChannelId = process.env.SENTINEL_ALERT_CHANNEL_ID;

  for (const keyword of KEYWORDS) {
    if (!content.includes(keyword)) continue;

    const channelKey = getCooldownKey(message.channel.id, keyword);
    const authorKey = `author:${message.author.id}`;

    if (isOnCooldown(channelKey) || isOnCooldown(authorKey)) continue;

    setCooldown(channelKey);
    setCooldown(authorKey);

    const excerpt = message.content.length > 200
      ? message.content.slice(0, 200) + '...'
      : message.content;

    const link = `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`;

    const embed = new EmbedBuilder()
      .setTitle('Keyword Alert')
      .setColor(0xff0000)
      .addFields(
        { name: 'Trigger Keyword', value: `\`${keyword}\``, inline: true },
        { name: 'Author', value: `${message.author.tag} (<@${message.author.id}>)`, inline: true },
        { name: 'Channel', value: `<#${message.channel.id}>`, inline: true },
        { name: 'Message Link', value: `[Jump to message](${link})`, inline: false },
        { name: 'Message Excerpt', value: excerpt.slice(0, 1024), inline: false },
        { name: 'Created At', value: message.createdAt.toUTCString(), inline: false },
        {
          name: 'Recommended Action',
          value: '1. Review context\n2. Do not react publicly too fast\n3. Ask for evidence if needed\n4. Use `/log-incident` only if admin review confirms it needs tracking',
          inline: false,
        },
      )
      .setTimestamp();

    logger.info(`Keyword triggered: "${keyword}" in #${message.channel.name} by ${message.author.tag}`);
    await sendAlert(message.client, alertChannelId, embed);
    break;
  }
}

module.exports = { checkMessage };
