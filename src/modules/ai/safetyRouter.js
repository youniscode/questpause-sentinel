const { KEYWORDS } = require('../../config/keywords');

const SAFE_REPLY = 'I appreciate you reaching out, but this sounds like something that should be handled through our report system rather than discussed here. Please use the 🛡️ **Report a Player** button in the Sentinel panel or the `/report-player` command to submit a private report. Our admin team will review it manually. Please avoid public discussions about the issue.';

function containsSeriousKeyword(text) {
  if (!text || typeof text !== 'string') return false;
  const lower = text.toLowerCase();
  return KEYWORDS.some((kw) => lower.includes(kw));
}

function getSafeReply() {
  return SAFE_REPLY;
}

module.exports = { containsSeriousKeyword, getSafeReply };
