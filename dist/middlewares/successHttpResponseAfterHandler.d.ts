import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
export interface SuccessHttpResponseHandler {
    event: APIGatewayProxyEvent;
    context: Context;
    response: APIGatewayProxyResult;
}
interface Options {
    headers?: Record<string, string>;
    response?: any;
    statusCode?: number;
    event?: Record<string, any>;
    debugMode?: boolean;
    zipWhenRequest?: string[];
}
export declare const successHttpResponseHandler: (opts: Options) => Promise<{
    headers: {
        'Access-Control-Allow-Origin': string;
        'Cache-Control': string;
        'Content-Type': string;
    } | {
        'Access-Control-Allow-Origin': string;
        'Cache-Control': string;
        'Content-Type': string;
    };
    statusCode: number;
    body: string;
}>;
/**
 * Formats response for successful responses
 */
export declare const successHttpResponseAfterHandler: (handler: SuccessHttpResponseHandler, next: (error?: any) => void, opts?: Options) => Promise<void>;
export default successHttpResponseAfterHandler;
