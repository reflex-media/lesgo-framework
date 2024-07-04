import { APIGatewayProxyResult, Context } from 'aws-lambda';
interface Options {
    response?: any;
    statusCode?: number;
    event?: Record<string, any>;
    debugMode?: boolean;
    headers?: Record<string, string>;
    error?: any;
    formatError?: (options: Options) => string;
}
export interface ErrorHttpResponseHandler {
    event: Record<string, any>;
    context: Context;
    error?: Error;
    response: APIGatewayProxyResult;
}
export declare const errorHttpResponseHandler: (opts: Options) => Promise<{
    headers: {
        'Access-Control-Allow-Origin': string;
        'Cache-Control': string;
        'Content-Type': string;
    } | {
        'Access-Control-Allow-Origin': string;
        'Cache-Control': string;
        'Content-Type': string;
    };
    statusCode: any;
    body: string;
}>;
/**
 * Formats response for error responses
 */
export declare const errorHttpResponseOnErrorHandler: (handler: ErrorHttpResponseHandler, next: (error?: any) => void, opts?: Options) => Promise<void>;
export default errorHttpResponseOnErrorHandler;
