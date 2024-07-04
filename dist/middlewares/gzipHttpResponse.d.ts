import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
interface Handler {
    event: APIGatewayProxyEvent & {
        requestContext: {
            elb?: any;
            apiId?: any;
        };
    };
    response: APIGatewayProxyResult;
}
interface GzipHttpResponseOptions {
    zipWhenRequest?: string[];
}
/**
 * Perform zipping and add neccessary header
 */
export declare const gzip: (response: APIGatewayProxyResult) => Promise<APIGatewayProxyResult>;
/**
 * Determine request origin
 */
export declare const determineRequestOrigin: (handler: Handler) => string;
/**
 * Determine headers Accept-Encoding exist
 */
export declare const determineRequestAcceptEncoding: (handler: Handler) => boolean;
declare const gzipHttpResponse: (handler: Handler, options?: GzipHttpResponseOptions) => Promise<APIGatewayProxyResult>;
export default gzipHttpResponse;
