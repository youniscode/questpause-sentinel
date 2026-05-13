const keywordGuard = require('../modules/moderation/keywordGuard');
const triggerReplies = require('../modules/personas/triggerReplies');
const aiRouter = require('../modules/ai/aiRouter');

async function execute(message) {
  await keywordGuard.checkMessage(message);
  await triggerReplies.checkForTrigger(message);
  await aiRouter.handleMessage(message);
}

module.exports = { execute };
