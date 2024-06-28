Object.defineProperty(exports, '__esModule', { value: true });
const LesgoException_1 = require('../exceptions/LesgoException');
// TEMP To check if this is still relevant
// const getCurrentDateTime = () => {
//   return new Date().toUTCString();
// };
class LoggerService {
  constructor(opts = {}) {
    const defaultOptions = {
      logger: 'lesgo-logger',
      meta: {},
      transports: [],
    };
    const options = Object.assign(Object.assign({}, defaultOptions), {
      logger: opts.logger || defaultOptions.logger,
      meta: Object.assign(
        Object.assign({}, defaultOptions.meta),
        opts.defaultMeta || {}
      ),
      transports: opts.transports || [],
    });
    this.logger = options.logger;
    this.meta = options.meta;
    this.transports = options.transports;
    this.logLevels = {
      error: 0,
      warn: 1,
      notice: 2,
      info: 3,
      debug: 4,
    };
  }
  log(level, message, extra = {}) {
    if (level === undefined || !Object.keys(this.logLevels).includes(level)) {
      throw new LesgoException_1.default('Invalid level provided in log()');
    }
    const structuredMessage = this.structureLogMessage(level, message, extra);
    this.transports.map(transport => {
      // @ts-ignore
      return this[`${transport.logType}Logger`](level, structuredMessage);
    });
  }
  error(message, extra = {}) {
    this.log('error', message, extra);
  }
  warn(message, extra = {}) {
    this.log('warn', message, extra);
  }
  info(message, extra = {}) {
    this.log('info', message, extra);
  }
  debug(message, extra = {}) {
    this.log('debug', message, extra);
  }
  notice(message, extra = {}) {
    this.log('notice', message, extra);
  }
  addMeta(meta = {}) {
    this.meta = Object.assign(Object.assign({}, this.meta), meta);
  }
  // TEMP To check if this is still relevant
  //   consoleLogger(level: LogLevel, message: string) {
  //     if (!this.checkIsLogRequired('console', level)) return null;
  //     const refinedMessage = this.refineMessagePerTransport('console', message);
  //     const consoleFunc = level === 'notice' ? 'log' : level;
  //     return console[consoleFunc](JSON.stringify(refinedMessage)); // eslint-disable-line no-console
  //   }
  checkIsLogRequired(transportName, level) {
    const transport = this.getTransportByName(transportName);
    if (transport === undefined) {
      return false;
    }
    const transportLevel = transport.level;
    if (this.logLevels[transportLevel] < this.logLevels[level]) {
      return false;
    }
    return true;
  }
  structureLogMessage(level, message, extra) {
    const structuredMessage = {
      level,
      message,
      logger: this.logger,
      extra: Object.assign(Object.assign({}, this.meta), extra),
    };
    return structuredMessage;
  }
  // TEMP To check if this is still relevant
  //   refineMessagePerTransport(transportName: string, message: string) {
  //     const transport = this.getTransportByName(transportName);
  //     const refinedMessage = message;
  //     if (transport === undefined) {
  //       return refinedMessage;
  //     }
  //     if (transport.config !== undefined) {
  //       if (transport.config.meta !== undefined) {
  //         refinedMessage.extra = {
  //           ...refinedMessage.extra,˝
  //           ...transport.config.meta,
  //         };
  //       }
  //       if (transport.config.tags !== undefined) {
  //         refinedMessage.tags = transport.config.tags;
  //       }
  //       if (
  //         refinedMessage.tags !== undefined &&
  //         refinedMessage.extra.tags !== undefined
  //       ) {
  //         refinedMessage.tags = {
  //           ...refinedMessage.tags,
  //           ...refinedMessage.extra.tags,
  //         };
  //         delete refinedMessage.extra.tags;
  //       }
  //       if (transport.config.getCreatedAt) {
  //         refinedMessage.created = getCurrentDateTime();
  //       }
  //     }
  //     return refinedMessage;
  //   }
  getTransportByName(transportName) {
    return this.transports.find(
      transport => transport.logType === transportName
    );
  }
}
exports.default = LoggerService;
