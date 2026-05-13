const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const personaSettings = require('../modules/personas/personaSettings');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('persona-cooldown')
  .setDescription('[Admin] Change persona cooldown values')
  .addIntegerOption((opt) =>
    opt.setName('channel-minutes').setDescription('Per-channel cooldown (1–360 min)').setRequired(true)
      .setMinValue(1).setMaxValue(360),
  )
  .addIntegerOption((opt) =>
    opt.setName('player-minutes').setDescription('Per-player cooldown (1–720 min)').setRequired(true)
      .setMinValue(1).setMaxValue(720),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const channelMin = interaction.options.getInteger('channel-minutes');
  const playerMin = interaction.options.getInteger('player-minutes');

  personaSettings.setCooldowns(channelMin, playerMin);
  logger.info(`Persona cooldowns updated by ${interaction.user.tag}: channel=${channelMin}m, player=${playerMin}m`);

  await interaction.editReply({
    content: `Persona cooldowns updated — channel: ${channelMin} min, player: ${playerMin} min.`,
  });
}

module.exports = { data, execute };
