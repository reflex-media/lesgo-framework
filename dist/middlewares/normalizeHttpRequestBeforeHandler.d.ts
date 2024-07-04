import { APIGatewayProxyEvent, APIGatewayProxyEventHeaders, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyEventV2, APIGatewayProxyResult, Context } from 'aws-lambda';
interface Options {
    headers: APIGatewayProxyEventHeaders | null;
    qs: APIGatewayProxyEventQueryStringParameters | null | undefined;
    body: string | null | undefined;
}
type APIGatewayProxyEventAdditionals = {
    input: Record<string, any> | null;
    auth: Record<string, any>;
    version: string;
};
export interface NormalizeHttpRequestHandler {
    event: (APIGatewayProxyEvent & APIGatewayProxyEventAdditionals) | (APIGatewayProxyEventV2 & APIGatewayProxyEventAdditionals);
    response: APIGatewayProxyResult;
    context: Context;
}
export declare const normalizeRequest: (opts: Options) => any;
/**
 * Normalizes handler.event.body and handler.event.queryStringParameters
 * as handler.event.input Object
 */
export declare const normalizeHttpRequestBeforeHandler: (handler: NormalizeHttpRequestHandler, next: (error?: any) => void) => void;
export default normalizeHttpRequestBeforeHandler;
