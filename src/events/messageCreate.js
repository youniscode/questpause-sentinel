const keywordGuard = require('../modules/moderation/keywordGuard');

async function execute(message) {
  await keywordGuard.checkMessage(message);
}

module.exports = { execute };
