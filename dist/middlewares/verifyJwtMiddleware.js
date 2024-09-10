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
import { verify } from '../utils/jwt';
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';
const FILE = 'lesgo.middlewares.verifyJwtMiddleware';
const verifyJwtMiddleware = (secret, options) => {
  const verifyJwt = (token, secret, opts) => {
    try {
      const decoded = verify(token, secret, opts);
      return decoded;
    } catch (error) {
      throw new LesgoException(
        'Error verifying JWT',
        `${FILE}::ERROR_VERIFYING_JWT`,
        401,
        error
      );
    }
  };
  const verifyJwtMiddlewareBefore = request => {
    logger.debug(`${FILE}::JWT_TO_VERIFY`, { request, options });
    const token = request.event.headers.authorization;
    if (!token) {
      throw new LesgoException(
        'No token provided',
        `${FILE}::NO_TOKEN_PROVIDED`,
        401
      );
    }
    const decoded = verifyJwt(token, secret, options);
    logger.debug(`${FILE}::JWT_VERIFIED`, { decoded });
    request.event.jwt = decoded;
  };
  const verifyJwtMiddlewareAfter = request =>
    __awaiter(void 0, void 0, void 0, function* () {
      request.event = Object.assign(Object.assign({}, request.event), {
        extendedResponse: {
          _jwt: request.event.jwt,
        },
      });
    });
  return {
    before: verifyJwtMiddlewareBefore,
    after: verifyJwtMiddlewareAfter,
  };
};
export default verifyJwtMiddleware;
