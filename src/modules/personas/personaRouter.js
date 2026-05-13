const { PERSONAS } = require('../../config/personas');
const { TRIGGER_MAP } = require('../../config/triggers');
const { channelToGame } = require('../../config/channelGames');

function matchTrigger(content, channelId) {
  const lower = content.toLowerCase();

  const explicitGame = channelId ? channelToGame.get(channelId) : null;

  if (!explicitGame) return null;

  const config = TRIGGER_MAP[explicitGame];
  if (!config) return null;

  for (const keyword of config.keywords) {
    if (lower.includes(keyword)) {
      const replies = config.replies[keyword];
      if (replies && replies.length > 0) {
        return { game: explicitGame, keyword, replies };
      }
    }
  }

  return null;
}

function getPersona(game) {
  return PERSONAS[game] || null;
}

function pickReply(replies) {
  return replies[Math.floor(Math.random() * replies.length)];
}

function buildReply(game, keyword, replies) {
  const persona = getPersona(game);
  if (!persona) return null;
  return `${persona.emoji} ${persona.name}:\n${pickReply(replies)}`;
}

module.exports = { matchTrigger, buildReply };
