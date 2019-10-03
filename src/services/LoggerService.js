import * as Sentry from '@sentry/minimal';

import LesgoException from '../exceptions/LesgoException';

const getCurrentDateTime = () => {
  return new Date().toUTCString();
};

export default class LoggerService {
  constructor(opts = {}) {
    const defaultOptions = {
      logger: 'lesgo-logger',
      meta: {},
      transports: [],
    };

    const options = {
      ...defaultOptions,
      logger: opts.logger || defaultOptions.logger,
      meta: {
        ...defaultOptions.meta,
        ...(opts.defaultMeta || {}),
      },
      transports: opts.transports || [],
    };

    this.logger = options.logger;
    this.meta = options.meta;
    this.transports = options.transports;
    this.getCreatedAt = options.getCreatedAt;

    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    };
  }

  log(level, message, extra = {}) {
    if (level === undefined || !Object.keys(this.logLevels).includes(level)) {
      throw new LesgoException('Invalid level provided in log()');
    }

    const structuredMessage = this.structureLogMessage(level, message, extra);

    this.transports.map(transport => {
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

  addMeta(meta = {}) {
    this.meta = {
      ...this.meta,
      ...meta,
    };
  }

  consoleLogger(level, message) {
    if (!this.checkIsLogRequired('console', level)) return null;
    const refinedMessage = this.refineMessagePerTransport('console', message);
    return console[level](JSON.stringify(refinedMessage)); // eslint-disable-line no-console
  }

  sentryLogger(level, message) {
    if (!this.checkIsLogRequired('sentry', level)) return null;

    const context = this.refineMessagePerTransport('sentry', message);

    Sentry.withScope(scope => {
      scope.setExtras(context.extra);
      scope.setTags(context.tags);

      if (context.level === 'error') {
        return Sentry.captureException(
          context.message instanceof Error
            ? context.message
            : new Error(context.message)
        );
      }

      return Sentry.captureMessage(context.message, context.level);
    });

    /* istanbul ignore next */
    return Sentry.configureScope(scope => {
      scope.clear();
    });
  }

  checkIsLogRequired(transportName, level) {
    const transportLevel = this.getTransportByName(transportName).level;

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
      extra: {
        ...this.meta,
        ...extra,
      },
    };

    return structuredMessage;
  }

  refineMessagePerTransport(transportName, message) {
    const transport = this.getTransportByName(transportName);
    const refinedMessage = { ...message };

    if (transport.config !== undefined) {
      if (transport.config.meta !== undefined) {
        refinedMessage.extra = {
          ...refinedMessage.extra,
          ...transport.config.meta,
        };
      }

      if (transport.config.tags !== undefined) {
        refinedMessage.tags = transport.config.tags;
      }

      if (
        refinedMessage.tags !== undefined &&
        refinedMessage.extra.tags !== undefined
      ) {
        refinedMessage.tags = {
          ...refinedMessage.tags,
          ...refinedMessage.extra.tags,
        };

        delete refinedMessage.extra.tags;
      }

      if (transport.config.getCreatedAt) {
        refinedMessage.created = getCurrentDateTime();
      }
    }

    return refinedMessage;
  }

  getTransportByName(transportName) {
    return this.transports.find(
      transport => transport.logType === transportName
    );
  }
}
