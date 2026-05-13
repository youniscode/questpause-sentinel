const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const store = require('../storage/storeInterface');

const data = new SlashCommandBuilder()
  .setName('player-history')
  .setDescription('View incident history for a player')
  .addStringOption((opt) =>
    opt.setName('player').setDescription('Player name, ID, or mention').setRequired(true),
  );

async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const query = interaction.options.getString('player').trim().toLowerCase();

  const all = await store.read('incidents');
  if (!all || all.length === 0) {
    await interaction.editReply({ content: 'No incidents found. The incident log is empty.' });
    return;
  }

  const matches = all.filter((inc) => inc.player.toLowerCase().includes(query));

  if (matches.length === 0) {
    await interaction.editReply({
      content: `No incident history found for \`${interaction.options.getString('player').trim()}\`.`,
    });
    return;
  }

  const openCount = matches.filter((i) => i.status === 'Open').length;
  const resolvedCount = matches.filter((i) => i.status === 'Resolved').length;

  const sorted = [...matches].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const latest = sorted.slice(0, 5);

  const embed = new EmbedBuilder()
    .setTitle('Player History')
    .setColor(0x0099ff)
    .addFields(
      { name: 'Player Searched', value: interaction.options.getString('player').trim(), inline: false },
      { name: 'Total Incidents', value: String(matches.length), inline: true },
      { name: 'Open', value: String(openCount), inline: true },
      { name: 'Resolved', value: String(resolvedCount), inline: true },
    )
    .setTimestamp();

  const list = latest
    .map((inc) => {
      const date = new Date(inc.createdAt).toUTCString();
      return `\`${inc.id}\` — ${inc.game} — ${inc.type} — [${inc.severity}] — ${inc.status} — ${date}`;
    })
    .join('\n');

  embed.addFields({ name: `Latest ${latest.length} Incidents`, value: list || 'None', inline: false });

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
