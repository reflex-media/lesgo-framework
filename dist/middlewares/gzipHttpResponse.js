var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import * as zlib from 'zlib';
import LesgoException from '../exceptions/LesgoException';
/**
 * Perform zipping and add neccessary header
 */
export const gzip = response =>
  __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      try {
        zlib.gzip(response.body, (error, gzippedResponse) => {
          if (error) {
            reject(new LesgoException(error.message, 'GZIP_LIB_ERROR'));
          } else {
            response.body = gzippedResponse.toString('base64');
            response.isBase64Encoded = true;
            response.headers = Object.assign(
              Object.assign({}, response.headers),
              { 'Content-Encoding': 'gzip' }
            );
            resolve(response);
          }
        });
      } catch (err) {
        /* istanbul ignore next */
        reject(new LesgoException(err.message, 'GZIP_UNKNOWN_ERROR', 500));
      }
    });
  });
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
const gzipHttpResponse = (handler, options = {}) =>
  __awaiter(void 0, void 0, void 0, function* () {
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
      handler.response = yield gzip(handler.response);
    }
    return handler.response;
  });
export default gzipHttpResponse;
