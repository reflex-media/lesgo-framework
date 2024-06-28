Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const app_1 = require('config/app');
const LoggerService_1 = require('../services/LoggerService');
const transports = [
  {
    logType: 'console',
    level: /* istanbul ignore next */ app_1.default.debug ? 'debug' : 'info',
    config: {
      getCreatedAt: true,
      tags: {
        env: app_1.default.env,
        service: app_1.default.service || app_1.default.name,
      },
    },
  },
];
const loggerOptions = {
  defaultMeta: {},
  transports,
};
const logger = new LoggerService_1.default(loggerOptions);
exports.default = logger;
