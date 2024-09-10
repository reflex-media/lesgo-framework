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
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';
import { validateFields } from '../utils';
import { basicAuth as basicAuthConfig } from '../config';
const FILE = 'lesgo.middlewares.verifyBasicAuthMiddleware';
const verifyBasicAuthMiddleware = (options = {}) => {
  let decoded;
  let input;
  const verifyBasicAuth = basicAuth => {
    if (basicAuth.includes('Basic')) {
      basicAuth = basicAuth.replace('Basic ', '');
    }
    decoded = Buffer.from(basicAuth, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');
    logger.debug(`${FILE}::BASIC_AUTH_DECODED`, { username, password });
    try {
      input = validateFields({ username, password }, [
        { key: 'username', type: 'string', required: true },
        { key: 'password', type: 'string', required: true },
      ]);
    } catch (error) {
      throw new LesgoException(
        'Invalid basic auth due to missing fields',
        `${FILE}::INVALID_BASIC_AUTH_MISSING_FIELDS`,
        401,
        error
      );
    }
    const matchFound = basicAuthConfig.authorizedList.find(
      a => a.username === username && a.password === password
    );
    if (!matchFound) {
      throw new LesgoException(
        'Invalid basic auth due to no match found',
        `${FILE}::INVALID_BASIC_AUTH_NO_MATCH`,
        401
      );
    }
    return { username: input.username };
  };
  const verifyBasicAuthMiddlewareBefore = request => {
    logger.debug(`${FILE}::BASIC_AUTH_TO_VERIFY`, { request, options });
    const basicAuth = request.event.headers.authorization;
    if (!basicAuth) {
      throw new LesgoException(
        'No basic auth provided',
        `${FILE}::NO_BASIC_AUTH_PROVIDED`,
        401
      );
    }
    const decoded = verifyBasicAuth(basicAuth);
    logger.debug(`${FILE}::BASIC_AUTH_VERIFIED`);
    request.event.basicAuth = decoded;
  };
  const verifyBasicAuthMiddlewareAfter = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      request.event = Object.assign(Object.assign({}, request.event), {
        extendedResponse: {
          _basicAuth: request.event.basicAuth,
        },
      });
    });
  return {
    before: verifyBasicAuthMiddlewareBefore,
    after: verifyBasicAuthMiddlewareAfter,
  };
};
export default verifyBasicAuthMiddleware;
