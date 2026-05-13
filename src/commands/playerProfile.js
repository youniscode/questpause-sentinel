const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getPlayerProfile } = require('../modules/moderation/playerProfileService');

const SIGNAL_EMOJIS = {
  'Calm': '🟢',
  'Monitor': '🟡',
  'Caution': '🟠',
  'High Attention': '🔴',
};

const SIGNAL_COLORS = {
  'Calm': 0x00ff88,
  'Monitor': 0xffaa00,
  'Caution': 0xff6600,
  'High Attention': 0xff4444,
};

const data = new SlashCommandBuilder()
  .setName('player-profile')
  .setDescription('View full moderation profile for a player')
  .addStringOption((opt) =>
    opt.setName('player').setDescription('Player name, ID, or mention').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

function truncate(text, maxLen = 80) {
  if (!text || typeof text !== 'string') return '—';
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + '...';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const rawPlayer = interaction.options.getString('player').trim();
  const profile = await getPlayerProfile(rawPlayer);

  if (!profile.found) {
    await interaction.editReply({
      content: `No moderation profile found for \`${rawPlayer}\`.`,
    });
    return;
  }

  const signalEmoji = SIGNAL_EMOJIS[profile.signal] || '⚪';
  const color = SIGNAL_COLORS[profile.signal] || 0x0099ff;

  const embed = {
    color,
    title: `Player Profile: ${profile.playerName}`,
    fields: [
      {
        name: 'Admin Signal',
        value: `${signalEmoji} **${profile.signal}**`,
      },
      {
        name: 'Summary',
        value: [
          `**Incidents:** ${profile.stats.totalIncidents} total (${profile.stats.openIncidents} open, ${profile.stats.resolvedIncidents} resolved)`,
          `**Reports:** ${profile.stats.totalReports} total (${profile.stats.openReports} open, ${profile.stats.resolvedReports} resolved)`,
          `**Warnings:** ${profile.stats.activeWarnings} active, ${profile.stats.resolvedWarnings} resolved`,
          `**Watchlist:** ${profile.stats.activeWatchlist} active, ${profile.stats.removedWatchlist} removed`,
        ].join('\n'),
      },
    ],
    timestamp: new Date().toISOString(),
  };

  const activity = profile.latestActivity;
  if (activity.length > 0) {
    const lines = activity.map((item) => {
      const severity = item.severity ? ` [${item.severity}]` : '';
      const date = formatDate(item.createdAt);
      return `\`${item.id}\` **${item.type}** — ${item.game} — ${item.status}${severity} — ${date} — ${truncate(item.summary, 60)}`;
    });
    embed.fields.push({
      name: `Latest Activity (${activity.length})`,
      value: lines.join('\n'),
    });
  }

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
