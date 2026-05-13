function parseIds(envValue) {
  if (!envValue || !envValue.trim()) return [];
  return envValue.split(',').map((s) => s.trim()).filter(Boolean);
}

const ENV_TO_GAME = {
  VALHEIM_CHANNEL_IDS: 'Valheim',
  PROJECT_ZOMBOID_CHANNEL_IDS: 'Project Zomboid',
  ICARUS_CHANNEL_IDS: 'ICARUS',
  WINDROSE_CHANNEL_IDS: 'Windrose',
  MINECRAFT_CHANNEL_IDS: 'Minecraft',
  SEVEN_DAYS_TO_DIE_CHANNEL_IDS: '7 Days to Die',
};

const channelToGame = new Map();

for (const [envVar, game] of Object.entries(ENV_TO_GAME)) {
  const ids = parseIds(process.env[envVar]);
  for (const id of ids) {
    channelToGame.set(id, game);
  }
}

module.exports = { channelToGame };
