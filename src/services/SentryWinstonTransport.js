import Transport from 'winston-transport';
import * as Sentry from '@sentry/node';
import { isError } from '@sentry/utils/dist/is';

import { sentry } from '../config';

export default class SentryWinstonTransport extends Transport {
  constructor(opts = {}) {
    super(opts);

    this.name = 'winston-sentry';

    const defaultOptions = {
      dsn: sentry.dsn,
      level: 'info',
      levelsMap: {
        silly: 'debug',
        verbose: 'debug',
        info: 'info',
        debug: 'debug',
        warn: 'warning',
        error: 'error',
      },
      attachStacktrace: true,
    };

    const options = {
      ...defaultOptions,
      ...opts,
    };

    this.levelsMap = options.levelsMap;

    Sentry.init(options);
    Sentry.setTags(options.config.tags);
    Sentry.setTag('logger', 'winston-sentry');
    this.sentry = Sentry;
  }

  log(info, callback) {
    const { message, level, fingerprint, tags, label, ...meta } = info;

    setImmediate(() => {
      this.emit('logged', info);
    });

    const context = {};
    context.level = this.levelsMap[level];
    context.extra = meta;
    context.fingerprint = [fingerprint, process.env.NODE_ENV];

    this.sentry.withScope(scope => {
      scope.setExtras(context.extra);
      scope.setTags(tags);

      if (context.fingerprint) {
        scope.setFingerprint(context.fingerprint);
      }

      if (context.level === 'error' || context.level === 'fatal') {
        this.sentry.captureException(isError(info) ? info : new Error(message));
        return callback(null, true);
      }

      this.sentry.captureMessage(message, context.level);
      return callback(null, true);
    });
  }
}
