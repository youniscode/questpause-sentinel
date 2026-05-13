const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { buildPanelEmbed, buildPanelButtons } = require('../modules/moderation/reportPanel');

const data = new SlashCommandBuilder()
  .setName('sentinel-report-panel')
  .setDescription('Post the player report panel with buttons in a channel')
  .addChannelOption((opt) =>
    opt.setName('channel').setDescription('Channel to post the report panel in').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const channel = interaction.options.getChannel('channel', true);

  if (!channel.isTextBased()) {
    await interaction.editReply({ content: 'Please select a text channel.' });
    return;
  }

  try {
    const embed = buildPanelEmbed();
    const buttons = buildPanelButtons();
    await channel.send({ embeds: [embed], components: [buttons] });
    await interaction.editReply({ content: `Report panel posted in ${channel}.` });
  } catch (err) {
    await interaction.editReply({ content: `Failed to post panel: ${err.message}` });
  }
}

module.exports = { data, execute };
