import { NormalizeHttpRequestHandler } from './normalizeHttpRequestBeforeHandler';
import { SuccessHttpResponseHandler } from './successHttpResponseAfterHandler';
import { ErrorHttpResponseHandler } from './errorHttpResponseOnErrorHandler';
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
declare const httpMiddleware: (opts: Options) => {
    before: (handler: NormalizeHttpRequestHandler, next: Next) => void;
    after: (handler: SuccessHttpResponseHandler, next: Next) => Promise<void>;
    onError: (handler: ErrorHttpResponseHandler, next: Next) => Promise<void>;
};
export default httpMiddleware;
