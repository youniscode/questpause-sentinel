const logger = require('../utils/logger');

function execute(client) {

  const guilds = client.guilds.cache.map((guild) => `${guild.name} (${guild.id})`);

  if (guilds.length === 0) {
    logger.warn('No guilds found in client cache.');
  } else {
    logger.info(`Connected guilds: ${guilds.join(', ')}`);
  }
  client.user.setPresence({
    activities: [{ name: 'over the QUESTPAUSE Network', type: 4 }],
    status: 'online',
  });
}

module.exports = { execute };
