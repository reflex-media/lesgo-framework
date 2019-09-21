import { normalizeHttpRequestBeforeHandler } from './normalizeHttpRequest';
import { successHttpResponseAfterHandler } from './successHttpResponse';
import { errorHttpResponseAfterHandler } from './errorHttpResponse';

/**
 * Combines all http middlewares into a single middleware
 */
/* istanbul ignore next */
const http = opts => {
  return {
    before: (handler, next) => normalizeHttpRequestBeforeHandler(handler, next),
    after: (handler, next) =>
      successHttpResponseAfterHandler(handler, next, opts),
    onError: (handler, next) =>
      errorHttpResponseAfterHandler(handler, next, opts),
  };
};

export default http;
