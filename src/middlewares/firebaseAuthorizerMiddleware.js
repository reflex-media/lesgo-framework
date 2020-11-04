import jwt from 'jsonwebtoken';
import LesgoException from '../exceptions/LesgoException';
import isEmpty from '../utils/isEmpty';

export const getTokenFromHeader = headers => {
  if (!headers.authorization || isEmpty(headers.authorization)) {
    throw new LesgoException(
      'Missing authorization header in request',
      'AUTH_MISSING_AUTHORIZATION_HEADER',
      403
    );
  }

  return headers.authorization;
};

export const jwtMiddlewareBeforeHandler = async handler => {
  let decoded = null;

  try {
    const token = getTokenFromHeader(handler.event.headers);
    decoded = jwt.decode(token);
  } catch (err) {
    throw new LesgoException(
      'Failed to decode token',
      'JWT_DECODE_TOKEN',
      403,
      { err }
    );
  }

  // eslint-disable-next-line no-param-reassign
  handler.event.auth = decoded;
};

const firebaseAuthorizerMiddleware /* istanbul ignore next */ = () => {
  return {
    before: handler => jwtMiddlewareBeforeHandler(handler),
  };
};

export default firebaseAuthorizerMiddleware;
