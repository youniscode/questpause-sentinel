const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const reportLogger = require('./reportLogger');
const logger = require('../../utils/logger');

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setTitle('🛡️ Contact QUESTPAUSE Sentinel')
    .setColor(0x0099ff)
    .setDescription(
      'If you need to report a player or an issue within the QUESTPAUSE Network, use the buttons below.\n\n' +
      '**How it works:**\n' +
      '• All reports are private and sent directly to the admin team\n' +
      '• Our team reviews each report manually — no automatic actions\n' +
      '• Please provide as much detail and evidence as possible\n' +
      '• Avoid public arguments or accusations in chat\n' +
      '• False or spam reports may be ignored\n\n' +
      '**QUESTPAUSE Sentinel does not punish automatically.**\n' +
      'Human admins review all reports and decide on appropriate action.',
    )
    .setTimestamp();
}

function buildPanelButtons() {
  return new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('sentinel_report_player')
        .setEmoji('🛡️')
        .setLabel('Report a Player')
        .setStyle(ButtonStyle.Danger),
      new ButtonBuilder()
        .setCustomId('sentinel_how_reports_work')
        .setEmoji('📘')
        .setLabel('How Reports Work')
        .setStyle(ButtonStyle.Secondary),
    );
}

function buildReportModal() {
  const modal = new ModalBuilder()
    .setCustomId('sentinel_report_modal')
    .setTitle('Report a Player');

  const reportedPlayerInput = new TextInputBuilder()
    .setCustomId('reported_player')
    .setLabel('Reported player')
    .setPlaceholder('Enter the player\'s in-game name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const gameInput = new TextInputBuilder()
    .setCustomId('game')
    .setLabel('Game / world')
    .setPlaceholder('e.g. Valheim, Project Zomboid, ICARUS, etc.')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const issueInput = new TextInputBuilder()
    .setCustomId('issue')
    .setLabel('What happened?')
    .setPlaceholder('Describe the issue in detail')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const evidenceInput = new TextInputBuilder()
    .setCustomId('evidence')
    .setLabel('Evidence / screenshot link')
    .setPlaceholder('Optional: provide a link or description of evidence')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  const extraInput = new TextInputBuilder()
    .setCustomId('extra')
    .setLabel('Anything else?')
    .setPlaceholder('Optional: anything else admins should know')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder().addComponents(reportedPlayerInput),
    new ActionRowBuilder().addComponents(gameInput),
    new ActionRowBuilder().addComponents(issueInput),
    new ActionRowBuilder().addComponents(evidenceInput),
    new ActionRowBuilder().addComponents(extraInput),
  );

  return modal;
}

function buildHowReportsWorkEmbed() {
  return new EmbedBuilder()
    .setTitle('📘 How Reports Work')
    .setColor(0x0099ff)
    .setDescription(
      '**Reports are private.**\n' +
      'When you submit a report, it is sent directly to the QUESTPAUSE admin team. No one else sees it.\n\n' +
      '**Admins review manually.**\n' +
      'Your report is reviewed by a human admin. They check chat logs, game activity, and any evidence you provide.\n\n' +
      '**Evidence helps.**\n' +
      'Screenshots, timestamps, and clear descriptions make it much easier for admins to take appropriate action.\n\n' +
      '**No automatic punishment.**\n' +
      'QUESTPAUSE Sentinel never bans, warns, or punishes anyone automatically. All moderation decisions are made by a human admin.\n\n' +
      '**False or spam reports** may be ignored or noted.\n\n' +
      '**If you submitted a report**, please avoid public arguments while the team reviews it.',
    )
    .setTimestamp();
}

async function handleReportModalSubmit(interaction, client) {
  const reportedPlayer = interaction.fields.getTextInputValue('reported_player').trim();
  const game = interaction.fields.getTextInputValue('game').trim();
  const issue = interaction.fields.getTextInputValue('issue').trim();
  const evidence = interaction.fields.getTextInputValue('evidence')?.trim() || null;
  const extra = interaction.fields.getTextInputValue('extra')?.trim() || null;

  const fullIssue = extra ? `${issue}\n\n**Extra info:** ${extra}` : issue;

  if (reportedPlayer.toLowerCase() === interaction.user.username.toLowerCase()) {
    await interaction.reply({ content: 'You cannot report yourself.', ephemeral: true });
    return;
  }

  const report = await reportLogger.addReport({
    reportedPlayer,
    reporterId: interaction.user.id,
    reporterTag: interaction.user.tag,
    game,
    issue: fullIssue,
    evidence,
  });

  if (!report) {
    await interaction.reply({ content: 'Failed to submit report. Please try again later.', ephemeral: true });
    return;
  }

  logger.info(`Report ${report.id} filed by ${interaction.user.tag} (via panel) against ${reportedPlayer}`);

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
    .setDescription('Your report has been sent to the QUESTPAUSE admin team. Please avoid public arguments while the team reviews it.')
    .setTimestamp();

  await interaction.reply({ embeds: [confirmEmbed], ephemeral: true });

  const reportChannelId = process.env.SENTINEL_REPORT_CHANNEL_ID;
  if (reportChannelId) {
    try {
      const channel = await client.channels.fetch(reportChannelId);
      if (channel) {
        const alertEmbed = new EmbedBuilder()
          .setTitle('New Player Report (via Panel)')
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

async function handleHowReportsWork(interaction) {
  const embed = buildHowReportsWorkEmbed();
  await interaction.reply({ embeds: [embed], ephemeral: true });
}

module.exports = {
  buildPanelEmbed,
  buildPanelButtons,
  buildReportModal,
  handleReportModalSubmit,
  handleHowReportsWork,
};
