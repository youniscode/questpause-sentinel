const levelOrder = { error: 0, warn: 1, info: 2, debug: 3 };
let currentLevel = 'info';

function setLevel(level) {
  if (levelOrder[level] !== undefined) currentLevel = level;
}

function log(level, message, ...args) {
  if (levelOrder[level] > levelOrder[currentLevel]) return;
  const ts = new Date().toISOString();
  const prefix = process.env.NODE_ENV === 'production' ? `[${ts}] [${level.toUpperCase()}]` : `[${level.toUpperCase()}]`;
  const full = `${prefix} ${message}`;
  if (level === 'error') {
    console.error(full, ...args);
  } else if (level === 'warn') {
    console.warn(full, ...args);
  } else {
    console.log(full, ...args);
  }
}

module.exports = {
  setLevel,
  error: (msg, ...args) => log('error', msg, ...args),
  warn: (msg, ...args) => log('warn', msg, ...args),
  info: (msg, ...args) => log('info', msg, ...args),
  debug: (msg, ...args) => log('debug', msg, ...args),
};
