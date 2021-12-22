import { verifyBasicAuthBeforeHandler } from './basicAuthMiddleware';
import { verifyJwtMiddlewareBeforeHandler } from './verifyJwtMiddleware';
import { errorHttpResponseAfterHandler } from './errorHttpResponseMiddleware';
import logger from '../utils/logger';

const blacklistMode = opts => {
  if (opts && typeof opts.blacklistMode !== 'undefined') {
    return !!opts.blacklistMode;
  }

  return true;
};

export const serverAuthBeforeHandler = (handler, next, opts) => {
  try {
    return verifyBasicAuthBeforeHandler(handler, next, opts);
  } catch (e) {
    logger.info('TRIGGERED', e);

    if (
      e.code !==
      `Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE`
    )
      throw e;
  }

  try {
    return verifyJwtMiddlewareBeforeHandler(handler, next, opts);
  } catch (e) {
    if (!blacklistMode(opts) && e.code !== 'JWT_MISSING_AUTHORIZATION_HEADER')
      throw e;
    else throw e;
  }
};

/* istanbul ignore next */
const serverAuthMiddleware = opts => {
  return {
    before: (handler, next) => serverAuthBeforeHandler(handler, next, opts),
    onError: (handler, next) => errorHttpResponseAfterHandler(handler, next),
  };
};

export default serverAuthMiddleware;
