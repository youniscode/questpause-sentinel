const keywordGuard = require('../modules/moderation/keywordGuard');
const triggerReplies = require('../modules/personas/triggerReplies');

async function execute(message) {
  await keywordGuard.checkMessage(message);
  await triggerReplies.checkForTrigger(message);
}

module.exports = { execute };
