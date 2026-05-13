const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const watchlistLogger = require('../modules/moderation/watchlistLogger');
const logger = require('../utils/logger');

const games = ['Valheim', 'Project Zomboid', 'ICARUS', 'Windrose', 'Minecraft', '7 Days to Die', 'Discord', 'Network'];
const severities = ['Low', 'Medium', 'High', 'Critical'];

const data = new SlashCommandBuilder()
  .setName('watch-player')
  .setDescription('[Admin] Add a player to the watchlist')
  .addStringOption((opt) =>
    opt.setName('player').setDescription('Player name or mention').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('game').setDescription('Game context')
      .setRequired(true)
      .addChoices(...games.map((g) => ({ name: g, value: g }))),
  )
  .addStringOption((opt) =>
    opt.setName('reason').setDescription('Reason for watchlisting').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('severity').setDescription('Severity level')
      .setRequired(true)
      .addChoices(...severities.map((s) => ({ name: s, value: s }))),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const player = interaction.options.getString('player').trim();
  const game = interaction.options.getString('game');
  const reason = interaction.options.getString('reason').trim();
  const severity = interaction.options.getString('severity');

  const entry = await watchlistLogger.addWatch({ player, game, reason, severity, createdBy: interaction.user.id });

  if (!entry) {
    await interaction.editReply({ content: 'Failed to add watchlist entry. Please try again.' });
    return;
  }

  logger.info(`Watchlist entry ${entry.id} created by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Player Added to Watchlist')
    .setColor(0xff6600)
    .addFields(
      { name: 'Watch ID', value: `\`${entry.id}\``, inline: true },
      { name: 'Player', value: entry.player, inline: true },
      { name: 'Game', value: entry.game, inline: true },
      { name: 'Severity', value: entry.severity, inline: true },
      { name: 'Status', value: entry.status, inline: true },
      { name: 'Created By', value: `<@${entry.createdBy}>`, inline: true },
      { name: 'Created At', value: new Date(entry.createdAt).toUTCString(), inline: false },
      { name: 'Reason', value: entry.reason.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
