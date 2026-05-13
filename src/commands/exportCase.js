const { SlashCommandBuilder, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const { generateMarkdown } = require('../modules/moderation/exportCaseService');

const data = new SlashCommandBuilder()
  .setName('export-case')
  .setDescription('Export a moderation record as a Markdown file')
  .addStringOption((opt) =>
    opt.setName('id').setDescription('Record ID (e.g. QP-REP-0001, QP-INC-0001, QP-WARN-0001, QP-WATCH-0001)').setRequired(true),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const rawId = interaction.options.getString('id').trim();
  const result = await generateMarkdown(rawId);

  if (result.error) {
    await interaction.editReply({ content: result.error });
    return;
  }

  const buf = Buffer.from(result.markdown, 'utf8');
  const attachment = new AttachmentBuilder(buf, { name: result.filename });

  await interaction.editReply({
    content: `📄 Exported **${rawId}**`,
    files: [attachment],
  });
}

module.exports = { data, execute };
