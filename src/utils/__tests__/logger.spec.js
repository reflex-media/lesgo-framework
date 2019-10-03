import logger from '../logger';
import { sentry } from '../../config';

describe('test logger utils', () => {
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
