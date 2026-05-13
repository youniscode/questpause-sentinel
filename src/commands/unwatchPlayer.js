const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const watchlistLogger = require('../modules/moderation/watchlistLogger');
const logger = require('../utils/logger');

const data = new SlashCommandBuilder()
  .setName('unwatch-player')
  .setDescription('[Admin] Remove a player from the watchlist')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Watch ID (e.g. QP-WATCH-0001)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('removal-reason').setDescription('Reason for removal').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const watchId = interaction.options.getString('id').trim();
  const removalReason = interaction.options.getString('removal-reason').trim();

  const result = await watchlistLogger.removeWatch(watchId, interaction.user.id, removalReason);

  if (result.error === 'not_found') {
    await interaction.editReply({ content: `No watchlist entry found with ID \`${watchId}\`.` });
    return;
  }

  if (result.error === 'already_removed') {
    await interaction.editReply({ content: `Watchlist entry \`${watchId}\` is already inactive.` });
    return;
  }

  const entry = result.entry;
  logger.info(`Watchlist entry ${watchId} removed by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Player Removed from Watchlist')
    .setColor(0xcc3300)
    .addFields(
      { name: 'Watch ID', value: `\`${entry.id}\``, inline: true },
      { name: 'Player', value: entry.player, inline: true },
      { name: 'Game', value: entry.game, inline: true },
      { name: 'Previous Status', value: 'Active', inline: true },
      { name: 'New Status', value: entry.status, inline: true },
      { name: 'Removed By', value: `<@${entry.removedBy}>`, inline: true },
      { name: 'Removed At', value: new Date(entry.removedAt).toUTCString(), inline: false },
      { name: 'Removal Reason', value: entry.removalReason.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
