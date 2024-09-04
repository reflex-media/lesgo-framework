import LesgoException from '../../exceptions/LesgoException';
import { logger } from '../../utils';

describe('logger', () => {
  beforeEach(() => {
    jest.resetModules();
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
});
