import LesgoException from '../../exceptions/LesgoException';
import { logger } from '../../utils';
import LoggerService from '../../services/LoggerService';

describe('logger', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('should create a logger instance', () => {
    expect(logger).toBeDefined();
  });

  it('should have the correct log level', () => {
    const expectedLogLevel = 'info';
    expect(logger.transports[0].level).toEqual(expectedLogLevel);
  });

  it('should log as an error', () => {
    const spyOnConsole = jest.spyOn(console, 'error');
    logger.error('test error');

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should log as a warn', () => {
    const spyOnConsole = jest.spyOn(console, 'warn');
    logger.warn('test warn');

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should log as an info', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    logger.info('test info');

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should log as a defined log', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    logger.log('info', 'test info log');

    expect(spyOnConsole).toHaveBeenCalled();
  });

  it('should throw an error if level is undefined', () => {
    expect(() => {
      // @ts-ignore
      logger.log('undefined-level', 'test undefined log');
    }).toThrow(new LesgoException('Invalid level provided in log()'));
  });

  it('should handle functions in extras without throwing circular error', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const myFunc = function testFunction() {
      return 'test';
    };

    expect(() => {
      logger.info('test with function', { myFunc });
    }).not.toThrow();

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    // Check that the function was sanitized
    expect(parsed.extra).toBeDefined();
    expect(parsed.extra.myFunc).toBe('[Function: testFunction]');

    spyOnConsole.mockRestore();
  });

  it('should handle anonymous functions in extras', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const anonymousFunc = () => 'test';

    expect(() => {
      logger.info('test with anonymous function', { anonymousFunc });
    }).not.toThrow();

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    // Arrow functions assigned to variables take the variable name
    expect(parsed.extra.anonymousFunc).toBe('[Function: anonymousFunc]');

    spyOnConsole.mockRestore();
  });

  it('should handle circular references in extras', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const circularObj: any = { name: 'test' };
    circularObj.self = circularObj; // Create circular reference

    expect(() => {
      logger.info('test with circular reference', { circularObj });
    }).not.toThrow();

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.circularObj.self).toBe('[Circular]');

    spyOnConsole.mockRestore();
  });

  it('should handle mixed objects with functions and circular references', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const myFunc = function helper() {
      return 'help';
    };
    const mixedObj: any = {
      name: 'test',
      func: myFunc,
      nested: {
        value: 123,
      },
    };
    mixedObj.nested.parent = mixedObj; // Create circular reference

    expect(() => {
      logger.info('test with mixed object', { mixedObj });
    }).not.toThrow();

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.mixedObj.func).toBe('[Function: helper]');
    expect(parsed.extra.mixedObj.nested.parent).toBe('[Circular]');
    expect(parsed.extra.mixedObj.nested.value).toBe(123);

    spyOnConsole.mockRestore();
  });

  it('should handle arrays with functions', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const func1 = function first() {
      return 1;
    };
    const func2 = function second() {
      return 2;
    };

    expect(() => {
      logger.info('test with array of functions', { funcs: [func1, func2] });
    }).not.toThrow();

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.funcs[0]).toBe('[Function: first]');
    expect(parsed.extra.funcs[1]).toBe('[Function: second]');

    spyOnConsole.mockRestore();
  });

  it('should log as debug', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'debug',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'debug');
    customLogger.debug('test debug');

    expect(spyOnConsole).toHaveBeenCalled();
    spyOnConsole.mockRestore();
  });

  it('should log as notice', () => {
    const spyOnConsole = jest.spyOn(console, 'log');
    logger.notice('test notice');

    expect(spyOnConsole).toHaveBeenCalled();
    spyOnConsole.mockRestore();
  });

  it('should handle Date objects in extras', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const testDate = new Date('2023-01-01T00:00:00.000Z');

    logger.info('test with date', { testDate });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.testDate).toBe('2023-01-01T00:00:00.000Z');

    spyOnConsole.mockRestore();
  });

  it('should handle Error objects in extras', () => {
    const spyOnConsole = jest.spyOn(console, 'error');
    const testError = new Error('Test error message');

    logger.error('test with error object', { testError });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.testError).toBeDefined();
    // Error objects may serialize differently, so we check that it's handled without throwing
    expect(typeof parsed.extra.testError).toBe('object');

    spyOnConsole.mockRestore();
  });

  it('should handle null and undefined values in extras', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test with null and undefined', {
      nullValue: null,
      undefinedValue: undefined,
    });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.nullValue).toBeNull();
    expect(parsed.extra.undefinedValue).toBeUndefined();

    spyOnConsole.mockRestore();
  });

  it('should handle empty objects and arrays', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test with empty structures', {
      emptyObj: {},
      emptyArray: [],
    });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.emptyObj).toEqual({});
    expect(parsed.extra.emptyArray).toEqual([]);

    spyOnConsole.mockRestore();
  });

  it('should include structured log message format', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test message', { extraData: 'value' });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.level).toBe('info');
    expect(parsed.message).toBe('test message');
    expect(parsed.logger).toBeDefined();
    expect(parsed.extra).toBeDefined();
    expect(parsed.extra.extraData).toBe('value');

    spyOnConsole.mockRestore();
  });

  it('should add meta using addMeta method', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    logger.addMeta({ userId: '123', requestId: 'abc' });

    logger.info('test with added meta');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.userId).toBe('123');
    expect(parsed.extra.requestId).toBe('abc');

    spyOnConsole.mockRestore();
  });

  it('should merge meta from addMeta with extra in log calls', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    logger.addMeta({ userId: '123' });

    logger.info('test with merged meta', { requestId: 'abc' });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.userId).toBe('123');
    expect(parsed.extra.requestId).toBe('abc');

    spyOnConsole.mockRestore();
  });

  it('should include created timestamp when getCreatedAt is true', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test with timestamp');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.created).toBeDefined();
    expect(typeof parsed.created).toBe('string');

    spyOnConsole.mockRestore();
  });

  it('should include tags from transport config', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test with tags');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.tags).toBeDefined();
    expect(parsed.tags.env).toBeDefined();
    expect(parsed.tags.service).toBeDefined();

    spyOnConsole.mockRestore();
  });

  it('should merge tags from extra.tags with transport config tags', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test with merged tags', {
      tags: { customTag: 'customValue' },
    });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.tags).toBeDefined();
    expect(parsed.tags.customTag).toBe('customValue');
    expect(parsed.tags.env).toBeDefined();
    expect(parsed.extra.tags).toBeUndefined();

    spyOnConsole.mockRestore();
  });

  it('should respect log level filtering - debug should not log when transport level is info', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'debug');
    customLogger.debug('this should not log');

    expect(spyOnConsole).not.toHaveBeenCalled();
    spyOnConsole.mockRestore();
  });

  it('should log when log level is equal to transport level', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'warn',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'warn');
    customLogger.warn('this should log');

    expect(spyOnConsole).toHaveBeenCalled();
    spyOnConsole.mockRestore();
  });

  it('should log when log level is lower than transport level', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'debug',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'error');
    customLogger.error('this should log');

    expect(spyOnConsole).toHaveBeenCalled();
    spyOnConsole.mockRestore();
  });

  it('should handle transport config meta', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: false,
            meta: {
              serviceMeta: 'serviceValue',
            },
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'info');
    customLogger.info('test with transport meta');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.serviceMeta).toBe('serviceValue');

    spyOnConsole.mockRestore();
  });

  it('should handle multiple transports', () => {
    const customLogger = new LoggerService({
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: false,
          },
        },
        {
          logType: 'console',
          level: 'error',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'info');
    customLogger.info('test with multiple transports');

    expect(spyOnConsole).toHaveBeenCalledTimes(2);
    spyOnConsole.mockRestore();
  });

  it('should handle defaultMeta from constructor', () => {
    const customLogger = new LoggerService({
      defaultMeta: {
        defaultKey: 'defaultValue',
      },
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'info');
    customLogger.info('test with default meta');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.defaultKey).toBe('defaultValue');

    spyOnConsole.mockRestore();
  });

  it('should handle custom logger name', () => {
    const customLogger = new LoggerService({
      logger: 'custom-logger',
      transports: [
        {
          logType: 'console',
          level: 'info',
          config: {
            getCreatedAt: false,
          },
        },
      ],
    });

    const spyOnConsole = jest.spyOn(console, 'info');
    customLogger.info('test with custom logger name');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.logger).toBe('custom-logger');

    spyOnConsole.mockRestore();
  });

  it('should handle deeply nested objects', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const nestedObj = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 'deep value',
            },
          },
        },
      },
    };

    logger.info('test with nested object', { nestedObj });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.nestedObj.level1.level2.level3.level4.value).toBe(
      'deep value'
    );

    spyOnConsole.mockRestore();
  });

  it('should handle complex mixed data types', () => {
    const spyOnConsole = jest.spyOn(console, 'info');
    const complexData = {
      string: 'text',
      number: 42,
      boolean: true,
      nullValue: null,
      array: [1, 2, 3],
      object: { key: 'value' },
      date: new Date('2023-01-01'),
      func: function named() {
        return 'result';
      },
    };

    logger.info('test with complex data', { complexData });

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra.complexData.string).toBe('text');
    expect(parsed.extra.complexData.number).toBe(42);
    expect(parsed.extra.complexData.boolean).toBe(true);
    expect(parsed.extra.complexData.nullValue).toBeNull();
    expect(parsed.extra.complexData.array).toEqual([1, 2, 3]);
    expect(parsed.extra.complexData.object.key).toBe('value');
    expect(parsed.extra.complexData.date).toBe('2023-01-01T00:00:00.000Z');
    expect(parsed.extra.complexData.func).toBe('[Function: named]');

    spyOnConsole.mockRestore();
  });

  it('should throw error when level is undefined in log()', () => {
    expect(() => {
      // @ts-ignore
      logger.log(undefined, 'test message');
    }).toThrow(new LesgoException('Invalid level provided in log()'));
  });

  it('should handle empty message string', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('');

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.message).toBe('');

    spyOnConsole.mockRestore();
  });

  it('should handle empty extra object', () => {
    const spyOnConsole = jest.spyOn(console, 'info');

    logger.info('test message', {});

    expect(spyOnConsole).toHaveBeenCalled();
    const callArgs = spyOnConsole.mock.calls[0][0];
    const parsed = JSON.parse(callArgs);
    expect(parsed.extra).toBeDefined();

    spyOnConsole.mockRestore();
  });
});
