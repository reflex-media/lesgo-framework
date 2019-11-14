import sentry from 'Config/sentry'; // eslint-disable-line import/no-unresolved
import logger from '../logger';

describe('UtilsGroup: test logger utils', () => {
  it('test logger', () => {
    sentry.enabled = true;
    logger.info('some info log');

    expect(logger.transports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ logType: 'console' }),
        expect.objectContaining({ logType: 'sentry' }),
      ])
    );
  });
});
