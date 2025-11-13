import LesgoException from '../exceptions/LesgoException';
import { getCurrentDatetime } from '../utils';

type LogLevel = 'error' | 'warn' | 'notice' | 'info' | 'debug';

interface LoggerServiceOptions {
  logger?: string;
  defaultMeta?: object;
  transports?: Array<Transport>;
}

interface Transport {
  logType: string;
  level: string;
  config?: TransportConfig;
}

interface TransportConfig {
  getCreatedAt?: boolean;
  meta?: object;
  tags?: TransportConfigTags;
}

interface TransportConfigTags {
  [key: string]: string;
}

export default class LoggerService {
  logger: string;

  meta: object;

  transports: Array<Transport>;

  logLevels: { [key: string]: number };

  constructor(opts: LoggerServiceOptions = {}) {
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

    this.logLevels = {
      error: 0,
      warn: 1,
      notice: 2,
      info: 3,
      debug: 4,
    };
  }

  log(level: LogLevel, message: string, extra = {}) {
    if (level === undefined || !Object.keys(this.logLevels).includes(level)) {
      throw new LesgoException('Invalid level provided in log()');
    }

    const structuredMessage = this.structureLogMessage(level, message, extra);

    this.transports.map(transport => {
      // @ts-ignore
      return this[`${transport.logType}Logger`](level, structuredMessage);
    });
  }

  error(message: string, extra = {}) {
    this.log('error', message, extra);
  }

  warn(message: string, extra = {}) {
    this.log('warn', message, extra);
  }

  info(message: string, extra = {}) {
    this.log('info', message, extra);
  }

  debug(message: string, extra = {}) {
    this.log('debug', message, extra);
  }

  notice(message: string, extra = {}) {
    this.log('notice', message, extra);
  }

  addMeta(meta = {}) {
    this.meta = {
      ...this.meta,
      ...meta,
    };
  }

  consoleLogger(level: LogLevel, message: string) {
    if (!this.checkIsLogRequired('console', level)) return null;
    const refinedMessage = this.refineMessagePerTransport('console', message);
    const consoleFunc = level === 'notice' ? 'log' : level;
    const sanitizedMessage = this.sanitizeForJson(refinedMessage);

    return console[consoleFunc](JSON.stringify(sanitizedMessage));
  }

  checkIsLogRequired(transportName: string, level: LogLevel) {
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

  structureLogMessage(level: LogLevel, message: any, extra: object) {
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

  refineMessagePerTransport(transportName: string, message: any) {
    const transport = this.getTransportByName(transportName);
    const refinedMessage = message;

    if (transport === undefined) {
      return refinedMessage;
    }

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
        refinedMessage.created = getCurrentDatetime();
      }
    }

    return refinedMessage;
  }

  getTransportByName(transportName: string) {
    return this.transports.find(
      transport => transport.logType === transportName
    );
  }

  /**
   * Sanitizes an object for JSON serialization by:
   * - Replacing functions with a string representation (similar to console.log behavior)
   * - Handling circular references
   * - Preserving other values
   */
  sanitizeForJson(obj: any, seen = new WeakSet()): any {
    // Handle null and undefined
    if (obj === null || obj === undefined) {
      return obj;
    }

    // Handle functions - replace with string representation like console.log does
    if (typeof obj === 'function') {
      const funcName = obj.name || 'anonymous';
      return `[Function: ${funcName}]`;
    }

    // Handle primitives
    if (typeof obj !== 'object') {
      return obj;
    }

    // Handle circular references
    if (seen.has(obj)) {
      return '[Circular]';
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString();
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      seen.add(obj);
      return obj.map(item => this.sanitizeForJson(item, seen));
    }

    // Handle objects
    seen.add(obj);
    const sanitized: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        try {
          sanitized[key] = this.sanitizeForJson(obj[key], seen);
        } catch (error) {
          // If we can't serialize a property, replace it with error message
          sanitized[key] = `[Error: ${
            error instanceof Error ? error.message : 'Unknown error'
          }]`;
        }
      }
    }

    return sanitized;
  }
}
