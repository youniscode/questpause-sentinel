require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');
const config = require('./config');
const sentinelStatus = require('./commands/sentinelStatus');
const readyEvent = require('./events/ready');
const interactionCreate = require('./events/interactionCreate');

interactionCreate.registerCommands([sentinelStatus]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(sentinelStatus.data.name, sentinelStatus);

async function init() {
  try {
    client.once('clientReady', () => readyEvent.execute(client));
    client.on('interactionCreate', (i) => interactionCreate.execute(i));

    const token = process.env.DISCORD_TOKEN;
    if (!token) {
      logger.error('DISCORD_TOKEN is not set in environment');
      process.exit(1);
    }

    await client.login(token);
  } catch (err) {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  }
}

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled rejection: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
});

init();
