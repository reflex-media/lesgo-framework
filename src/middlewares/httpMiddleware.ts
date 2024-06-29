import normalizeHttpRequestBeforeHandler, {
  NormalizeHttpRequestHandler,
} from './normalizeHttpRequestBeforeHandler';
import successHttpResponseAfterHandler, {
  SuccessHttpResponseHandler,
} from './successHttpResponseAfterHandler';
import errorHttpResponseOnErrorHandler, {
  ErrorHttpResponseHandler,
} from './errorHttpResponseOnErrorHandler';

type Next = (error?: any) => void;

interface Options {
  headers?: Record<string, string>;
  response?: any;
  statusCode?: number;
  event?: Record<string, any>;
  debugMode?: boolean;
  zipWhenRequest?: string[];
}

/**
 * Combines all http middlewares into a single middleware
 */
/* istanbul ignore next */
const httpMiddleware = (opts: Options) => {
  return {
    before: (handler: NormalizeHttpRequestHandler, next: Next) =>
      normalizeHttpRequestBeforeHandler(handler, next),
    after: (handler: SuccessHttpResponseHandler, next: Next) =>
      successHttpResponseAfterHandler(handler, next, opts),
    onError: (handler: ErrorHttpResponseHandler, next: Next) =>
      errorHttpResponseOnErrorHandler(handler, next, opts),
  };
};

export default httpMiddleware;
