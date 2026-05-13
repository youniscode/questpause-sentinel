const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getDashboardData, truncate, formatDate } = require('../modules/moderation/dashboardService');

const data = new SlashCommandBuilder()
  .setName('sentinel-dashboard')
  .setDescription('Show a moderation dashboard overview')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const { stats, latestOpen } = await getDashboardData();

  const totalOpen = stats.openIncidents + stats.openReports + stats.activeWarnings + stats.activeWatchlist;

  let color = 0x00ff88;
  if (totalOpen > 0) color = 0xffaa00;
  if (totalOpen >= 5) color = 0xff4444;

  const summaryLines = [
    `**Open Incidents:** ${stats.openIncidents} | **Resolved Incidents:** ${stats.resolvedIncidents}`,
    `**Open Reports:** ${stats.openReports} | **Resolved Reports:** ${stats.resolvedReports}`,
    `**Active Warnings:** ${stats.activeWarnings} | **Resolved Warnings:** ${stats.resolvedWarnings}`,
    `**Active Watchlist:** ${stats.activeWatchlist} | **Removed Watchlist:** ${stats.removedWatchlist}`,
  ];

  const embed = {
    color,
    title: '🛡️ Moderation Dashboard',
    fields: [
      {
        name: 'Summary',
        value: summaryLines.join('\n'),
      },
    ],
    timestamp: new Date().toISOString(),
  };

  if (latestOpen.length === 0) {
    embed.fields.push({
      name: 'Latest Open Items',
      value: 'No open moderation items. Network looks calm.',
    });
  } else {
    for (const item of latestOpen) {
      const severity = item.severity ? ` | Severity: ${item.severity}` : '';
      embed.fields.push({
        name: `${item.type}: ${item.id}`,
        value: [
          `**Player:** ${item.player}`,
          `**Game:** ${item.game}${severity}`,
          `**Created:** ${formatDate(item.createdAt)}`,
          `**Summary:** ${truncate(item.summary, 120)}`,
        ].join('\n'),
      });
    }
  }

  await interaction.editReply({ embeds: [embed], ephemeral: true });
}

module.exports = { data, execute };
