import zlib from 'zlib';
import LesgoException from '../exceptions/LesgoException';

/**
 * Perform zipping and add neccessary header
 */
export const gzip = async response => {
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
      reject(new LesgoException(err.message, 'GZIP_UNKNOWN_ERROR', 500));
    }
  });
};

/**
 * Determine request origin
 */
export const determineRequestOrigin = handler => {
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
export const determineRequestAcceptEncoding = handler => {
  const { headers } = handler.event;

  let acceptEncoding =
    headers['Accept-encoding'] ||
    headers['accept-encoding'] ||
    headers['Accept-Encoding'];

  if (acceptEncoding) {
    // normalise header
    const re = / /g;
    acceptEncoding = acceptEncoding
      .replace(re, '')
      .toLowerCase()
      .split(',');

    if (acceptEncoding.includes('gzip')) {
      return true;
    }
  }

  return false;
};

export const gzipHttpResponse = async (handler, options = {}) => {
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
