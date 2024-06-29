import * as zlib from 'zlib';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import LesgoException from '../exceptions/LesgoException';

interface Handler {
  event: APIGatewayProxyEvent & { requestContext: { elb?: any; apiId?: any } };
  response: APIGatewayProxyResult;
}

interface GzipHttpResponseOptions {
  zipWhenRequest?: string[];
}

/**
 * Perform zipping and add neccessary header
 */
export const gzip = async (
  response: APIGatewayProxyResult
): Promise<APIGatewayProxyResult> => {
  return new Promise((resolve, reject) => {
    try {
      zlib.gzip(response.body, (error, gzippedResponse) => {
        if (error) {
          reject(new LesgoException(error.message, 'GZIP_LIB_ERROR'));
        } else {
          response.body = gzippedResponse.toString('base64');
          response.isBase64Encoded = true;
          response.headers = {
            ...response.headers,
            'Content-Encoding': 'gzip',
          };
          resolve(response);
        }
      });
    } catch (err) {
      /* istanbul ignore next */
      reject(
        new LesgoException((err as Error).message, 'GZIP_UNKNOWN_ERROR', 500)
      );
    }
  });
};

/**
 * Determine request origin
 */
export const determineRequestOrigin = (handler: Handler) => {
  const { requestContext } = handler.event;
  let requestFrom = 'APIGATEWAY';

  if (requestContext.elb) {
    requestFrom = 'ELB';
  }

  if (requestContext.apiId) {
    requestFrom = 'APIGATEWAY';
  }

  return requestFrom;
};

/**
 * Determine headers Accept-Encoding exist
 */
export const determineRequestAcceptEncoding = (handler: Handler) => {
  const { headers } = handler.event;

  const acceptEncoding =
    headers['Accept-encoding'] ||
    headers['accept-encoding'] ||
    headers['Accept-Encoding'];

  if (acceptEncoding) {
    // normalise header
    const re = / /g;
    const acceptEncodingArr = acceptEncoding
      .replace(re, '')
      .toLowerCase()
      .split(',');

    if (acceptEncodingArr.includes('gzip')) {
      return true;
    }
  }

  return false;
};

const gzipHttpResponse = async (
  handler: Handler,
  options: GzipHttpResponseOptions = {}
) => {
  /*
   * By default we zip on ELB request only, but you also add APIGATEWAY
   * Supported Request [ELB, APIGATEWAY]
   */
  let zipWhenRequest = ['ELB'];
  if (options.zipWhenRequest) {
    zipWhenRequest = options.zipWhenRequest;
  }

  const requestFrom = determineRequestOrigin(handler);

  if (
    zipWhenRequest.includes(requestFrom) &&
    determineRequestAcceptEncoding(handler)
  ) {
    // eslint-disable-next-line no-param-reassign
    handler.response = await gzip(handler.response);
  }

  return handler.response;
};

export default gzipHttpResponse;
