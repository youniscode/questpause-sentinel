const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const warningLogger = require('../modules/moderation/warningLogger');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('resolve-warning')
  .setDescription('[Admin] Resolve an active warning')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Warning ID (e.g. QP-WARN-0001)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('resolution').setDescription('Resolution notes').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const warningId = interaction.options.getString('id').trim();
  const resolution = interaction.options.getString('resolution').trim();

  const result = await warningLogger.resolveWarning(warningId, resolution, interaction.user.id);

  if (result.error === 'not_found') {
    await interaction.editReply({ content: `No warning found with ID \`${warningId}\`.` });
    return;
  }

  if (result.error === 'already_resolved') {
    await interaction.editReply({ content: `Warning \`${warningId}\` is already resolved.` });
    return;
  }

  const warn = result.warning;
  logger.info(`Warning ${warningId} resolved by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Warning Resolved')
    .setColor(0x00cc66)
    .addFields(
      { name: 'Warning ID', value: `\`${warn.id}\``, inline: true },
      { name: 'Player', value: warn.player, inline: true },
      { name: 'Game', value: warn.game, inline: true },
      { name: 'Severity', value: warn.severity, inline: true },
      { name: 'Previous Status', value: 'Active', inline: true },
      { name: 'New Status', value: warn.status, inline: true },
      { name: 'Resolved By', value: `<@${warn.resolvedBy}>`, inline: true },
      { name: 'Resolved At', value: new Date(warn.resolvedAt).toUTCString(), inline: false },
      { name: 'Resolution', value: warn.resolution.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
