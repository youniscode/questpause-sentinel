const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const personaSettings = require('../modules/personas/personaSettings');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('persona-toggle')
  .setDescription('[Admin] Enable or disable persona replies')
  .addBooleanOption((opt) =>
    opt.setName('enabled').setDescription('Enable persona replies?').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const enabled = interaction.options.getBoolean('enabled');
  personaSettings.setEnabled(enabled);
  logger.info(`Persona replies ${enabled ? 'enabled' : 'disabled'} by ${interaction.user.tag}`);

  await interaction.editReply({
    content: `Persona replies have been ${enabled ? 'enabled' : 'disabled'}.`,
  });
}

module.exports = { data, execute };
