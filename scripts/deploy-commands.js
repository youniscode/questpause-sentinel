require('dotenv').config();
const { REST, Routes } = require('discord.js');
const logger = require('../src/utils/logger');

const commands = [
  require('../src/commands/sentinelStatus'),
  require('../src/commands/logIncident'),
  require('../src/commands/playerHistory'),
  require('../src/commands/resolveIncident'),
  require('../src/commands/addWarning'),
  require('../src/commands/resolveWarning'),
  require('../src/commands/reportPlayer'),
  require('../src/commands/resolveReport'),
  require('../src/commands/watchPlayer'),
  require('../src/commands/unwatchPlayer'),
  require('../src/commands/personaStatus'),
  require('../src/commands/personaToggle'),
  require('../src/commands/personaCooldown'),
];

const commandData = commands.map((cmd) => cmd.data.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    logger.info(`Deploying ${commandData.length} slash commands...`);

    const clientId = process.env.DISCORD_CLIENT_ID;
    const guildId = process.env.DISCORD_GUILD_ID;

    if (!clientId) {
      logger.error('DISCORD_CLIENT_ID is not set in environment');
      process.exit(1);
    }

    let result;
    if (guildId && guildId.trim()) {
      result = await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commandData,
      });
      logger.info(`Deployed ${result.length} commands to guild ${guildId}`);
    } else {
      result = await rest.put(Routes.applicationCommands(clientId), {
        body: commandData,
      });
      logger.info(`Deployed ${result.length} global commands`);
    }
  } catch (err) {
    logger.error(`Failed to deploy commands: ${err.message}`);
    process.exit(1);
  }
})();
