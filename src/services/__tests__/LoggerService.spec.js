/* eslint no-console: 0 */

import LoggerService from '../LoggerService';
import LesgoException from '../../exceptions/LesgoException';

describe('ServicesGroup: test LoggerService instantiation', () => {
  it('test instantiate default LoggerService', () => {
    const logger = new LoggerService();

    expect(logger.logger).toBe('lesgo-logger');
    expect(logger.meta).toMatchObject({});
    expect(logger.transports).toEqual(expect.arrayContaining([]));
    expect(logger.logLevels).toMatchObject({
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    });
  });

  it('test instantiate LoggerService with console transport', () => {
    const logger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: true,
          },
        },
      ],
    });

    expect(logger.logger).toBe('lesgo-logger');
    expect(logger.meta).toMatchObject({});
    expect(logger.transports[0]).toMatchObject({
      logType: 'console',
      level: 'info',
      config: {
        getCreatedAt: true,
      },
    });
  });

  it('test instantiate LoggerService with default meta', () => {
    const logger = new LoggerService({
      defaultMeta: {
        someMeta1: 'someMeta1',
        someMeta2: 'someMeta2',
      },
    });

    expect(logger.logger).toBe('lesgo-logger');
    expect(logger.meta).toMatchObject({
      someMeta1: 'someMeta1',
      someMeta2: 'someMeta2',
    });
  });
});

describe('ServicesGroup: test log LoggerService with console transport', () => {
  const consoleTransportConfig = {
    transports: [
      {
        logType: 'console',
        level: 'info',
        config: {
          tags: {
            addTag: 'config.tags.addTag',
          },
          meta: {
            addMeta: 'config.meta.addMeta',
          },
        },
      },
    ],
  };

  it('test log with undefined level', () => {
    const logger = new LoggerService();
    expect(() => logger.log('invalidLevel', 'some message')).toThrow(
      new LesgoException('Invalid level provided in log()')
    );
  });

  it('test log with undefined transport', () => {
    const logger = new LoggerService();
    logger.log('info', 'some info log');

    expect(console.info).not.toHaveBeenCalled();
  });

  it('test log with log method', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.log('info', 'some info log');

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with info level', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.info('some info log');

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with debug level', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.debug('some debug log');

    expect(console.debug).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'debug',
        message: 'some debug log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with warn level', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.warn('some warn log');

    expect(console.warn).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'warn',
        message: 'some warn log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with error level', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.error('some error log');

    expect(console.error).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'some error log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with custom meta', () => {
    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.addMeta({
      someMeta: 'someMeta',
    });
    logger.log('info', 'some info log');

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {
          someMeta: 'someMeta',
        },
      })
    );
  });

  it('test log with custom empty meta', () => {
    console.info = jest.fn();

    const logger = new LoggerService({ transports: [{ logType: 'console' }] });
    logger.addMeta();
    logger.log('info', 'some info log');

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {},
      })
    );
  });

  it('test log with lower level', () => {
    console.info = jest.fn();

    const logger = new LoggerService({
      transports: [{ logType: 'console', level: 'error' }],
    });
    logger.log('info', 'some info log');

    expect(console.info).not.toHaveBeenCalled();
  });

  it('test log with additional meta in config', () => {
    const logger = new LoggerService(consoleTransportConfig);
    logger.log('info', 'some info log');

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {
          addMeta: 'config.meta.addMeta',
        },
        tags: {
          addTag: 'config.tags.addTag',
        },
      })
    );
  });

  it('test log with additional tag and meta in message log', () => {
    const logger = new LoggerService(consoleTransportConfig);
    logger.log('info', 'some info log', {
      tags: { addTag2: 'someTag' },
      someMoreMeta: 'someMetaAdded',
    });

    expect(console.info).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'info',
        message: 'some info log',
        logger: 'lesgo-logger',
        extra: {
          someMoreMeta: 'someMetaAdded',
          addMeta: 'config.meta.addMeta',
        },
        tags: {
          addTag: 'config.tags.addTag',
          addTag2: 'someTag',
        },
      })
    );
  });
});
