const path = require('path');
const fs = require('fs');

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf-8'),
);

module.exports = {
  version: pkg.version,
  name: pkg.name,
  environment: process.env.NODE_ENV || 'development',
};
