import config from 'Config/jwt'; // eslint-disable-line import/no-unresolved
import JwtService from '../services/JwtService';
import LesgoException from '../exceptions/LesgoException';

export const token = headers => {
  const authorizationHeader = headers.Authorization || headers.authorization;

  if (!authorizationHeader) {
    throw new LesgoException(
      'Authorization Header is required!',
      'JWT_MISSING_AUTHORIZATION_HEADER',
      403
    );
  }

  const parsed = authorizationHeader.split(' ');

  if (!parsed[1]) {
    throw new LesgoException(
      'Missing Bearer token!',
      'JWT_MISSING_BEARER_TOKEN',
      403
    );
  }

  return parsed[1];
};

export const verifyJwtMiddlewareBeforeHandler = (handler, next) => {
  const { headers } = handler.event;

  try {
    const service = new JwtService(token(headers), config);

    // eslint-disable-next-line no-param-reassign
    handler.event.decodedJwt = service.validate().decoded;

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new LesgoException(err.message, 'JWT_ERROR', 403);
    } else if (err.name === 'TokenExpiredError') {
      throw new LesgoException(err.message, 'JWT_EXPIRED', 403);
    } else {
      throw err;
    }
  }
};

/* istanbul ignore next */
const verifyJwtMiddleware = () => {
  return {
    before: (handler, next) => verifyJwtMiddlewareBeforeHandler(handler, next),
  };
};

export default verifyJwtMiddleware;
