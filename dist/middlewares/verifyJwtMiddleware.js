import { verify } from '../utils/jwt';
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';
const FILE = 'lesgo.middlewares.verifyJwtMiddleware';
const verifyJwtMiddleware = (options = {}) => {
  const verifyJwt = (token, opts) => {
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
    verifyJwt(token, options);
    logger.debug(`${FILE}::JWT_VERIFIED`);
  };
  return {
    before: verifyJwtMiddlewareBefore,
  };
};
export default verifyJwtMiddleware;
