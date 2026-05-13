const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warningLogger = require('../modules/moderation/warningLogger');
const logger = require('../utils/logger');

const GAMES = [
  { name: 'Valheim', value: 'Valheim' },
  { name: 'Project Zomboid', value: 'Project Zomboid' },
  { name: 'ICARUS', value: 'ICARUS' },
  { name: 'Windrose', value: 'Windrose' },
  { name: 'Minecraft', value: 'Minecraft' },
  { name: '7 Days to Die', value: '7 Days to Die' },
  { name: 'Discord', value: 'Discord' },
  { name: 'Network', value: 'Network' },
];

const SEVERITIES = [
  { name: 'Low', value: 'Low' },
  { name: 'Medium', value: 'Medium' },
  { name: 'High', value: 'High' },
  { name: 'Critical', value: 'Critical' },
];

const data = new SlashCommandBuilder()
  .setName('add-warning')
  .setDescription('[Admin] Issue a warning to a player')
  .addStringOption((opt) =>
    opt.setName('player').setDescription('Player name or mention').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('game').setDescription('Game the warning applies to').setRequired(true)
      .addChoices(...GAMES),
  )
  .addStringOption((opt) =>
    opt.setName('severity').setDescription('Warning severity').setRequired(true)
      .addChoices(...SEVERITIES),
  )
  .addStringOption((opt) =>
    opt.setName('reason').setDescription('Reason for the warning').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const player = interaction.options.getString('player');
  const game = interaction.options.getString('game');
  const severity = interaction.options.getString('severity');
  const reason = interaction.options.getString('reason');

  const warning = await warningLogger.addWarning({
    player,
    game,
    severity,
    reason,
    createdBy: interaction.user.id,
  });

  if (!warning) {
    await interaction.editReply({ content: 'Failed to issue warning. Check server logs.' });
    return;
  }

  logger.info(`Warning ${warning.id} issued by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Warning Issued')
    .setColor(0xff8800)
    .addFields(
      { name: 'Warning ID', value: `\`${warning.id}\``, inline: true },
      { name: 'Player', value: warning.player, inline: true },
      { name: 'Game', value: warning.game, inline: true },
      { name: 'Severity', value: warning.severity, inline: true },
      { name: 'Status', value: warning.status, inline: true },
      { name: 'Created By', value: `<@${warning.createdBy}>`, inline: true },
      { name: 'Created At', value: new Date(warning.createdAt).toUTCString(), inline: false },
      { name: 'Reason', value: warning.reason.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
