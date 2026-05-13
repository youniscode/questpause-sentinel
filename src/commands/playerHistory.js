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

  const rawPlayer = interaction.options.getString('player').trim();

  const allIncidents = (await store.read('incidents')) || [];
  const allWarnings = (await store.read('warnings')) || [];
  const allWatchlist = (await store.read('watchlist')) || [];

  const incMatches = allIncidents.filter((inc) => inc.player.toLowerCase().includes(query));
  const warnMatches = allWarnings.filter((w) => w.player.toLowerCase().includes(query));
  const watchMatches = allWatchlist.filter((w) => w.player.toLowerCase().includes(query));

  if (incMatches.length === 0 && warnMatches.length === 0 && watchMatches.length === 0) {
    await interaction.editReply({
      content: `No history found for \`${rawPlayer}\`.`,
    });
    return;
  }

  const openCount = incMatches.filter((i) => i.status === 'Open').length;
  const resolvedCount = incMatches.filter((i) => i.status === 'Resolved').length;
  const activeWarnings = warnMatches.filter((w) => w.status === 'Active').length;
  const resolvedWarnings = warnMatches.filter((w) => w.status === 'Resolved').length;
  const activeWatchCount = watchMatches.filter((w) => w.status === 'Active').length;

  const sortedInc = [...incMatches].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const latestInc = sortedInc.slice(0, 5);

  const sortedWarn = [...warnMatches].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
  const latestWarn = sortedWarn.slice(0, 5);

  const embed = new EmbedBuilder()
    .setTitle('Player History')
    .setColor(0x0099ff)
    .addFields(
      { name: 'Player Searched', value: rawPlayer, inline: false },
      { name: 'Total Incidents', value: String(incMatches.length), inline: true },
      { name: 'Open', value: String(openCount), inline: true },
      { name: 'Resolved', value: String(resolvedCount), inline: true },
      { name: 'Active Warnings', value: String(activeWarnings), inline: true },
      { name: 'Resolved Warnings', value: String(resolvedWarnings), inline: true },
      { name: 'Active Watchlist', value: String(activeWatchCount), inline: true },
    )
    .setTimestamp();

  if (incMatches.length > 0) {
    const incList = latestInc
      .map((inc) => {
        const date = new Date(inc.createdAt).toUTCString();
        return `\`${inc.id}\` — ${inc.game} — ${inc.type} — [${inc.severity}] — ${inc.status} — ${date}`;
      })
      .join('\n');
    embed.addFields({ name: `Latest ${latestInc.length} Incidents`, value: incList || 'None', inline: false });
  }

  if (warnMatches.length > 0) {
    const warnList = latestWarn
      .map((w) => {
        const date = new Date(w.createdAt).toUTCString();
        return `\`${w.id}\` — ${w.game} — [${w.severity}] — ${w.status} — ${date} — ${w.reason.slice(0, 80)}`;
      })
      .join('\n');
    embed.addFields({ name: `Latest ${latestWarn.length} Warnings`, value: warnList || 'None', inline: false });
  }

  if (watchMatches.length > 0) {
    const sortedWatch = [...watchMatches].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const latestWatch = sortedWatch.slice(0, 5);
    const watchList = latestWatch
      .map((w) => {
        const date = new Date(w.createdAt).toUTCString();
        return `\`${w.id}\` — ${w.game} — [${w.severity}] — ${w.status} — ${date} — ${w.reason.slice(0, 80)}`;
      })
      .join('\n');
    embed.addFields({ name: `Latest ${latestWatch.length} Watchlist Entries`, value: watchList || 'None', inline: false });
  }

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
