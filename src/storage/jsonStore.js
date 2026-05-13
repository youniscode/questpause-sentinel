const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DATA_DIR = path.join(process.cwd(), 'src', 'storage', 'data');

const collections = {
  incidents: { file: 'incidents.json', default: [] },
};

const cache = {};

function getFilePath(collection) {
  const cfg = collections[collection];
  if (!cfg) throw new Error(`Unknown collection: ${collection}`);
  return path.join(DATA_DIR, cfg.file);
}

async function init() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  for (const [name, cfg] of Object.entries(collections)) {
    const fp = getFilePath(name);
    try {
      if (fs.existsSync(fp)) {
        const raw = fs.readFileSync(fp, 'utf-8');
        cache[name] = JSON.parse(raw);
      } else {
        cache[name] = JSON.parse(JSON.stringify(cfg.default));
        fs.writeFileSync(fp, JSON.stringify(cfg.default, null, 2), 'utf-8');
      }
    } catch (err) {
      logger.error(`Failed to load ${name}: ${err.message}`);
      cache[name] = JSON.parse(JSON.stringify(cfg.default));
    }
  }
  logger.info('JSON storage initialized');
}

async function persist(collection) {
  const fp = getFilePath(collection);
  fs.writeFileSync(fp, JSON.stringify(cache[collection], null, 2), 'utf-8');
}

async function read(collection) {
  return cache[collection] ?? null;
}

async function write(collection, data) {
  cache[collection] = data;
  await persist(collection);
}

async function getById(collection, id) {
  const data = cache[collection];
  if (Array.isArray(data)) {
    return data.find((item) => item.id === id) ?? null;
  }
  return data[id] ?? null;
}

async function addItem(collection, item) {
  const data = cache[collection];
  if (Array.isArray(data)) {
    data.push(item);
    await persist(collection);
    return item;
  }
  if (data && typeof data === 'object') {
    data[item.id] = item;
    await persist(collection);
    return item;
  }
  return null;
}

async function updateItem(collection, id, updates) {
  const data = cache[collection];
  if (Array.isArray(data)) {
    const idx = data.findIndex((item) => item.id === id);
    if (idx === -1) return null;
    data[idx] = { ...data[idx], ...updates };
    await persist(collection);
    return data[idx];
  }
  if (data && typeof data === 'object') {
    if (!data[id]) return null;
    data[id] = { ...data[id], ...updates };
    await persist(collection);
    return data[id];
  }
  return null;
}

async function removeItem(collection, id) {
  const data = cache[collection];
  if (Array.isArray(data)) {
    const idx = data.findIndex((item) => item.id === id);
    if (idx === -1) return false;
    data.splice(idx, 1);
    await persist(collection);
    return true;
  }
  if (data && typeof data === 'object') {
    if (!data[id]) return false;
    delete data[id];
    await persist(collection);
    return true;
  }
  return false;
}

async function query(collection, predicate) {
  const data = cache[collection];
  if (Array.isArray(data)) {
    return data.filter(predicate);
  }
  if (data && typeof data === 'object') {
    return Object.values(data).filter(predicate);
  }
  return [];
}

module.exports = {
  init,
  read,
  write,
  getById,
  addItem,
  updateItem,
  removeItem,
  query,
};
