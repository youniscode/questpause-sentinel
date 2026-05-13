const logger = require('../utils/logger');
const reportPanel = require('../modules/moderation/reportPanel');

const commandMap = {};

function registerCommands(commands) {
  for (const cmd of commands) {
    commandMap[cmd.data.name] = cmd;
  }
}

async function execute(interaction, client) {
  if (interaction.isChatInputCommand()) {
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
    return;
  }

  if (interaction.isButton()) {
    try {
      if (interaction.customId === 'sentinel_report_player') {
        const modal = reportPanel.buildReportModal();
        await interaction.showModal(modal);
        return;
      }

      if (interaction.customId === 'sentinel_how_reports_work') {
        await reportPanel.handleHowReportsWork(interaction);
        return;
      }
    } catch (err) {
      logger.error(`Button handler error (${interaction.customId}): ${err.message}`);
    }
    return;
  }

  if (interaction.isModalSubmit()) {
    try {
      if (interaction.customId === 'sentinel_report_modal') {
        await reportPanel.handleReportModalSubmit(interaction, client);
        return;
      }
    } catch (err) {
      logger.error(`Modal handler error (${interaction.customId}): ${err.message}`);
    }
  }
}

module.exports = { execute, registerCommands };
