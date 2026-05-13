require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const logger = require('./utils/logger');
const config = require('./config');
const storeInterface = require('./storage/storeInterface');
const jsonStore = require('./storage/jsonStore');
const sentinelStatus = require('./commands/sentinelStatus');
const logIncident = require('./commands/logIncident');
const playerHistory = require('./commands/playerHistory');
const resolveIncident = require('./commands/resolveIncident');
const readyEvent = require('./events/ready');
const interactionCreate = require('./events/interactionCreate');

interactionCreate.registerCommands([sentinelStatus, logIncident, playerHistory, resolveIncident]);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.commands.set(sentinelStatus.data.name, sentinelStatus);
client.commands.set(logIncident.data.name, logIncident);
client.commands.set(playerHistory.data.name, playerHistory);
client.commands.set(resolveIncident.data.name, resolveIncident);

async function init() {
  try {
    storeInterface.setImplementation(jsonStore);
    await storeInterface.init();

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
