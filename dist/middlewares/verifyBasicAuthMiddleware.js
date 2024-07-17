import { verify } from '../utils/jwt';
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';
const FILE = 'lesgo.middlewares.verifyJwtMiddleware';
const verifyBasicAuthMiddleware = (options = {}) => {
  const verifyBasicAuth = (token, opts) => {
    try {
      verify(token, { secret: opts.secret, opts });
    } catch (error) {
      throw new LesgoException(
        'Error verifying JWT',
        `${FILE}::ERROR_VERIFYING_JWT`,
        401,
        error
      );
    }
  };
  const verifyBasicAuthMiddlewareBefore = request => {
    logger.debug(`${FILE}::JWT_TO_VERIFY`, { request, options });
    const token = request.event.headers.authorization;
    if (!token) {
      throw new LesgoException(
        'No token provided',
        `${FILE}::NO_TOKEN_PROVIDED`,
        401
      );
    }
    verifyBasicAuth(token, options);
    logger.debug(`${FILE}::JWT_VERIFIED`);
  };
  return {
    before: verifyBasicAuthMiddlewareBefore,
  };
};
export default verifyBasicAuthMiddleware;
