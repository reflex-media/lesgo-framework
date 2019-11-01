exports.printMsg = function printr() {
  // eslint-disable-next-line no-console
  console.log('Import specific middlewares as required.');
};

const middlewares = require('./build/middlewares');

exports.middlewares = middlewares;

const services = require('./build/services');

exports.services = services;

const utils = require('./build/utils');

exports.utils = utils;
