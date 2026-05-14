const { KEYWORDS } = require('../../config/keywords');

const SAFE_REPLY = 'I hear you, and I understand this is important. For fairness, reports need to go through the right channel. Please head over to #🛡️・report-a-player and include the game/world, the player name (if you know it), what happened, and any screenshots or evidence you have. Our admin team reviews every report manually — no automated action is taken. Please avoid discussing details here in public chat.';

function containsSeriousKeyword(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return KEYWORDS.some((kw) => lower.includes(kw));
}

function getSafeReply() {
  return SAFE_REPLY;
}

module.exports = { containsSeriousKeyword, getSafeReply };
