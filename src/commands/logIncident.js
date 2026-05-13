const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const incidentLogger = require('../modules/moderation/incidentLogger');
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
  .setName('log-incident')
  .setDescription('[Admin] Log a new incident')
  .addStringOption((opt) =>
    opt.setName('player').setDescription('Player involved (name or mention)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('game').setDescription('Game the incident occurred in').setRequired(true)
      .addChoices(...GAMES),
  )
  .addStringOption((opt) =>
    opt.setName('type').setDescription('Incident type (e.g. grief, exploit, harassment)').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('severity').setDescription('Severity level').setRequired(true)
      .addChoices(...SEVERITIES),
  )
  .addStringOption((opt) =>
    opt.setName('note').setDescription('Detailed description of the incident').setRequired(true),
  )
  .addStringOption((opt) =>
    opt.setName('evidence').setDescription('Link or text evidence (optional)').setRequired(false),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    await interaction.editReply({ content: 'You need Administrator permission to use this command.' });
    return;
  }

  const player = interaction.options.getString('player');
  const game = interaction.options.getString('game');
  const type = interaction.options.getString('type');
  const severity = interaction.options.getString('severity');
  const note = interaction.options.getString('note');
  const evidence = interaction.options.getString('evidence');

  const incident = await incidentLogger.logIncident({
    player,
    game,
    type,
    severity,
    note,
    evidence,
    createdBy: interaction.user.id,
  });

  if (!incident) {
    await interaction.editReply({ content: 'Failed to log incident. Check server logs.' });
    return;
  }

  logger.info(`Incident ${incident.id} logged by ${interaction.user.tag}`);

  const embed = new EmbedBuilder()
    .setTitle('Incident Logged')
    .setColor(0xff6600)
    .addFields(
      { name: 'Incident ID', value: incident.id, inline: true },
      { name: 'Player', value: incident.player, inline: true },
      { name: 'Game', value: incident.game, inline: true },
      { name: 'Type', value: incident.type, inline: true },
      { name: 'Severity', value: incident.severity, inline: true },
      { name: 'Status', value: incident.status, inline: true },
      { name: 'Created By', value: `<@${incident.createdBy}>`, inline: true },
      { name: 'Created At', value: new Date(incident.createdAt).toUTCString(), inline: false },
      { name: 'Note', value: incident.note.slice(0, 1024), inline: false },
    )
    .setTimestamp();

  if (incident.evidence) {
    embed.addFields({ name: 'Evidence', value: incident.evidence.slice(0, 1024), inline: false });
  }

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
