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
const addWarning = require('./commands/addWarning');
const resolveWarning = require('./commands/resolveWarning');
const reportPlayer = require('./commands/reportPlayer');
const resolveReport = require('./commands/resolveReport');
const watchPlayer = require('./commands/watchPlayer');
const unwatchPlayer = require('./commands/unwatchPlayer');
const readyEvent = require('./events/ready');
const interactionCreate = require('./events/interactionCreate');
const messageCreate = require('./events/messageCreate');

interactionCreate.registerCommands([sentinelStatus, logIncident, playerHistory, resolveIncident, addWarning, resolveWarning, reportPlayer, resolveReport, watchPlayer, unwatchPlayer]);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.commands.set(sentinelStatus.data.name, sentinelStatus);
client.commands.set(logIncident.data.name, logIncident);
client.commands.set(playerHistory.data.name, playerHistory);
client.commands.set(resolveIncident.data.name, resolveIncident);
client.commands.set(addWarning.data.name, addWarning);
client.commands.set(resolveWarning.data.name, resolveWarning);
client.commands.set(reportPlayer.data.name, reportPlayer);
client.commands.set(resolveReport.data.name, resolveReport);
client.commands.set(watchPlayer.data.name, watchPlayer);
client.commands.set(unwatchPlayer.data.name, unwatchPlayer);

async function init() {
  try {
    storeInterface.setImplementation(jsonStore);
    await storeInterface.init();

    const channelConfig = require('./config/channels');
    logger.info(`Channel config — monitored: ${channelConfig.monitoredChannelIds.size}, blocked channels: ${channelConfig.blockedChannelIds.size}, blocked categories: ${channelConfig.blockedCategoryIds.size}`);

    const { gameChannelCounts } = require('./config/channelGames');
    const personaSummary = Object.entries(gameChannelCounts)
      .filter(([, count]) => count > 0)
      .map(([game, count]) => `${game}: ${count}`)
      .join(', ');
    if (personaSummary) {
      logger.info(`Persona channels — ${personaSummary}`);
    } else {
      logger.info('Persona channels — none configured');
    }

    client.once('clientReady', () => readyEvent.execute(client));
    client.on('interactionCreate', (i) => interactionCreate.execute(i));
    client.on('messageCreate', (m) => messageCreate.execute(m));

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
