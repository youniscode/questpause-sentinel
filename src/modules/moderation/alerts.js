const logger = require('../../utils/logger');

async function sendAlert(client, alertChannelId, embed) {
  if (!alertChannelId) {
    logger.warn('SENTINEL_ALERT_CHANNEL_ID is not set — skipping admin alert');
    return;
  }

  try {
    const channel = await client.channels.fetch(alertChannelId);
    if (!channel) {
      logger.warn(`Alert channel ${alertChannelId} not found`);
      return;
    }
    await channel.send({ embeds: [embed] });
    logger.info('Admin alert sent');
  } catch (err) {
    logger.error(`Failed to send admin alert: ${err.message}`);
  }
}

module.exports = { sendAlert };
