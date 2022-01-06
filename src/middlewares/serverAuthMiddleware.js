import { verifyBasicAuthBeforeHandler } from './basicAuthMiddleware';
import { verifyJwtMiddlewareBeforeHandler } from './verifyJwtMiddleware';
import { errorHttpResponseAfterHandler } from './errorHttpResponseMiddleware';

export const serverAuthBeforeHandler = (handler, next, opts) => {
  try {
    return verifyBasicAuthBeforeHandler(handler, next, opts);
  } catch (e) {
    if (
      e.code !==
        `Middlewares/basicAuthMiddleware::AUTH_INVALID_AUTHORIZATION_TYPE` &&
      e.code !==
        `Middlewares/basicAuthMiddleware::AUTHORIZATION_HEADER_NOT_FOUND`
    )
      throw e;
  }

  return verifyJwtMiddlewareBeforeHandler(handler, next, opts);
};

/* istanbul ignore next */
const serverAuthMiddleware = opts => {
  return {
    before: (handler, next) => serverAuthBeforeHandler(handler, next, opts),
    onError: (handler, next) => errorHttpResponseAfterHandler(handler, next),
  };
};

export default serverAuthMiddleware;
