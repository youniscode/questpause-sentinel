const logger = require('../utils/logger');

const commandMap = {};

function registerCommands(commands) {
  for (const cmd of commands) {
    commandMap[cmd.data.name] = cmd;
  }
}

async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const command = commandMap[interaction.commandName];
  if (!command) {
    logger.warn(`Unknown command: ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    logger.error(`Command error (${interaction.commandName}): ${err.message}`);
    const reply = {
      content: 'An error occurred while executing this command.',
      ephemeral: true,
    };
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}

module.exports = { execute, registerCommands };
