import { normalizeHttpRequestBeforeHandler } from './normalizeHttpRequestMiddleware';
import { successHttpResponseAfterHandler } from './successHttpResponseMiddleware';
import { errorHttpResponseAfterHandler } from './errorHttpResponseMiddleware';

/**
 * Combines all http middlewares into a single middleware
 */
/* istanbul ignore next */
const httpMiddleware = opts => {
  return {
    before: (handler, next) => normalizeHttpRequestBeforeHandler(handler, next),
    after: (handler, next) =>
      successHttpResponseAfterHandler(handler, next, opts),
    onError: (handler, next) =>
      errorHttpResponseAfterHandler(handler, next, opts),
  };
};

export default httpMiddleware;
