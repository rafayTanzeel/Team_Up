'use strict';

const fs = require('fs');
const winston = require('winston');
const path = require('path');

const logPath = 'logs';

if (!fs.existsSync(logPath)) {
  fs.mkdirSync(logPath);
}

// winston Configuratiton
winston.add(winston.transports.File, {
  filename: path.join(logPath, 'error.log'),
  level: 'error',
});

module.exports = winston;
