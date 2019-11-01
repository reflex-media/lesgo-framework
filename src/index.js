exports.printMsg = function printr() {
  // eslint-disable-next-line no-console
  console.log('Import specific middlewares as required.');
};

const middlewares = require('./middlewares');

exports.middlewares = middlewares;

const services = require('./services');

exports.services = services;

const utils = require('./utils');

exports.utils = utils;
