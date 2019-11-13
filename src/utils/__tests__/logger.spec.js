import logger from '../logger';

describe('UtilsGroup: test logger utils', () => {
  it('test logger', () => {
    logger.info('some info log');

    expect(logger.transports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ logType: 'console' }),
        expect.objectContaining({ logType: 'sentry' }),
      ])
    );
  });
});
