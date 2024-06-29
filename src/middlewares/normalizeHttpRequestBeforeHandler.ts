import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventHeaders,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
// @ts-ignore
import app from 'config/app';
import getJwtSubFromAuthHeader from '../utils/getJwtSubFromAuthHeader';
import logger from '../utils/logger';

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
  event:
    | (APIGatewayProxyEvent & APIGatewayProxyEventAdditionals)
    | (APIGatewayProxyEventV2 & APIGatewayProxyEventAdditionals);
  response: APIGatewayProxyResult;
  context: Context;
}

export const normalizeRequest = (opts: Options) => {
  const { headers, body } = opts;
  let { qs } = opts;
  let input = null;

  // to be consistent with api gateway, we convert empty object to null
  if (JSON.stringify(qs) === '{}') qs = null;

  if (!headers && qs === null) return input;

  if (qs !== null) input = qs;

  const contentType = headers
    ? headers['Content-Type'] || headers['content-type']
    : null;

  if (!contentType) return input;

  /* istanbul ignore else */
  if (contentType.startsWith('application/json')) {
    try {
      input = { ...input, ...JSON.parse(body || '{}') };
    } catch (err) {
      throw new Error(
        'Content type defined as JSON but an invalid JSON was provided'
      );
    }
  }

  return input;
};

/**
 * Normalizes handler.event.body and handler.event.queryStringParameters
 * as handler.event.input Object
 */
export const normalizeHttpRequestBeforeHandler = (
  handler: Handler,
  next: (error?: any) => void
) => {
  const options = {
    headers: handler.event.headers,
    qs: handler.event.queryStringParameters,
    body: handler.event.body,
  };

  // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
  // eslint-disable-next-line no-param-reassign
  handler.context.callbackWaitsForEmptyEventLoop = false;

  // eslint-disable-next-line no-param-reassign
  handler.event.input = normalizeRequest(options);

  const authHeader =
    options.headers.Authorization || options.headers.authorization;

  const auth: { sub?: '' } = {};
  if (authHeader) {
    auth.sub = getJwtSubFromAuthHeader(authHeader);
  }

  // eslint-disable-next-line no-param-reassign
  handler.event.auth = auth;

  const tags: {
    path?: string;
    httpMethod?: string;
  } = {};
  switch (handler.event.version) {
    case '2.0': {
      if (
        handler.event.requestContext &&
        'http' in handler.event.requestContext
      ) {
        tags.path = handler.event.requestContext.http.path;
        tags.httpMethod = handler.event.requestContext.http.method;
      }
      break;
    }
    default:
      tags.path = 'path' in handler.event ? handler.event.path : '';
      tags.httpMethod =
        'httpMethod' in handler.event ? handler.event.httpMethod : '';
      break;
  }

  logger.addMeta({
    requestId: handler.event.requestContext
      ? handler.event.requestContext.requestId
      : null,
    tags,
  });

  if (app.debug) {
    logger.addMeta({
      auth: handler.event.auth,
      queryStringParameters: options.qs,
      body: options.body,
    });
  }

  /* istanbul ignore next */
  next();
};

export default normalizeHttpRequestBeforeHandler;
