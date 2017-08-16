'use strict';

const nconf = require('nconf');

// nconf Configuratiton
nconf.argv({
  'p': {
    'alias': 'http:port',
    'describe': 'The port to listen on',
  },
});

nconf.file('config.json');

nconf.defaults({
  'http': {
    'port': 8080,
  },
});

module.exports = nconf;
