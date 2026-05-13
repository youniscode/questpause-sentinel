const logger = require('../utils/logger');

let storeImpl = null;

function setImplementation(impl) {
  storeImpl = impl;
}

function getImpl() {
  if (!storeImpl) {
    throw new Error('Storage implementation not initialized');
  }
  return storeImpl;
}

async function init() {
  return getImpl().init();
}

async function read(collection) {
  return getImpl().read(collection);
}

async function write(collection, data) {
  return getImpl().write(collection, data);
}

async function getById(collection, id) {
  return getImpl().getById(collection, id);
}

async function addItem(collection, item) {
  return getImpl().addItem(collection, item);
}

async function updateItem(collection, id, updates) {
  return getImpl().updateItem(collection, id, updates);
}

async function removeItem(collection, id) {
  return getImpl().removeItem(collection, id);
}

async function query(collection, predicate) {
  return getImpl().query(collection, predicate);
}

module.exports = {
  setImplementation,
  init,
  read,
  write,
  getById,
  addItem,
  updateItem,
  removeItem,
  query,
};
