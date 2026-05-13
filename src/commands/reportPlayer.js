const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const reportLogger = require('../modules/moderation/reportLogger');
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

const data = new SlashCommandBuilder()
  .setName('report-player')
  .setDescription('Report a player for admin review')
  .addStringOption((opt) =>
    opt.setName('reported-player').setDescription('Name of the player you are reporting').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('game').setDescription('Game where the issue occurred').setRequired(true)
      .addChoices(...GAMES),
  )
  .addStringOption((opt) =>
    opt.setName('issue').setDescription('Describe what happened').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('evidence').setDescription('Link or description of evidence (optional)').setRequired(false),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const reportedPlayer = interaction.options.getString('reported-player').trim();
  const game = interaction.options.getString('game');
  const issue = interaction.options.getString('issue').trim();
  const evidence = interaction.options.getString('evidence')?.trim() || null;

  if (reportedPlayer.toLowerCase() === interaction.user.username.toLowerCase()) {
    await interaction.editReply({ content: 'You cannot report yourself.' });
    return;
  }

  const report = await reportLogger.addReport({
    reportedPlayer,
    reporterId: interaction.user.id,
    reporterTag: interaction.user.tag,
    game,
    issue,
    evidence,
  });

  if (!report) {
    await interaction.editReply({ content: 'Failed to submit report. Please try again later.' });
    return;
  }

  logger.info(`Report ${report.id} filed by ${interaction.user.tag} against ${reportedPlayer}`);

  const confirmEmbed = new EmbedBuilder()
    .setTitle('Report Submitted')
    .setColor(0xffaa00)
    .addFields(
      { name: 'Report ID', value: `\`${report.id}\``, inline: true },
      { name: 'Reported Player', value: reportedPlayer, inline: true },
      { name: 'Game', value: game, inline: true },
      { name: 'Status', value: report.status, inline: true },
      { name: 'Submitted At', value: new Date(report.createdAt).toUTCString(), inline: false },
    )
    .setDescription(
      'Your report has been sent to the QUESTPAUSE admin team. Please do not start public arguments in chat while the team reviews it.',
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [confirmEmbed] });

  const reportChannelId = process.env.SENTINEL_REPORT_CHANNEL_ID;
  if (reportChannelId) {
    try {
      const channel = await interaction.client.channels.fetch(reportChannelId);
      if (channel) {
        const alertEmbed = new EmbedBuilder()
          .setTitle('New Player Report')
          .setColor(0xff4444)
          .addFields(
            { name: 'Report ID', value: `\`${report.id}\``, inline: true },
            { name: 'Reporter', value: `<@${report.reporterId}>`, inline: true },
            { name: 'Reported Player', value: reportedPlayer, inline: true },
            { name: 'Game', value: game, inline: true },
            { name: 'Issue', value: issue.slice(0, 1024), inline: false },
            { name: 'Evidence', value: evidence || 'None provided', inline: false },
            { name: 'Status', value: report.status, inline: true },
            { name: 'Submitted At', value: new Date(report.createdAt).toUTCString(), inline: false },
            {
              name: 'Recommended Action',
              value:
                '1. Review context\n' +
                '2. Ask for evidence if needed\n' +
                '3. Avoid public accusations\n' +
                '4. Log an incident only if admin review confirms it needs tracking',
              inline: false,
            },
          )
          .setTimestamp();
        await channel.send({ embeds: [alertEmbed] });
      }
    } catch (err) {
      logger.warn(`Could not send report alert to channel ${reportChannelId}: ${err.message}`);
    }
  } else {
    logger.warn('SENTINEL_REPORT_CHANNEL_ID not set — report saved but no admin alert sent');
  }
}

module.exports = { data, execute };
