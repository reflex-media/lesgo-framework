import config from 'config/jwt'; // eslint-disable-line import/no-unresolved
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

export const verifyJwtMiddlewareBeforeHandler = async (handler, next, opts) => {
  const { headers } = handler.event;

  const finalConfig =
    typeof opts !== 'undefined' && 'jwtConfig' in opts
      ? opts.jwtConfig
      : config;

  const { secret, callback } = finalConfig;

  try {
    const service = new JwtService(token(headers), {
      ...finalConfig,
      ...{
        secret: typeof secret === 'function' ? secret(handler) : secret,
      },
    });

    // eslint-disable-next-line no-param-reassign
    handler.event.decodedJwt = service.validate().decoded;

    if (typeof callback === 'function') {
      await callback(handler);
    }

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      throw new LesgoException(err.message, 'JWT_ERROR', 403, err);
    } else if (err.name === 'TokenExpiredError') {
      throw new LesgoException(err.message, 'JWT_EXPIRED', 403, err);
    } else {
      throw err;
    }
  }
};

const verifyJwtMiddleware /* istanbul ignore next */ = opts => {
  return {
    before: (handler, next) =>
      verifyJwtMiddlewareBeforeHandler(handler, next, opts),
  };
};

export default verifyJwtMiddleware;
