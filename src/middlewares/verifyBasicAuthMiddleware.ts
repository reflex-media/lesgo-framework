import middy from '@middy/core';
import { verify } from '../utils/jwt';
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';

const FILE = 'lesgo.middlewares.verifyJwtMiddleware';

export interface VerifyJwtOptions {
  keyid?: string;
  algorithm?: string;
  validateClaims?: boolean;
  issuer?: string;
  audience?: string;
  secret?: string;
}

const verifyBasicAuthMiddleware = (options: VerifyJwtOptions = {}) => {
  const verifyBasicAuth = (token: string, opts: VerifyJwtOptions) => {
    try {
      verify(token, { secret: opts.secret, opts });
    } catch (error: any) {
      throw new LesgoException(
        'Error verifying JWT',
        `${FILE}::ERROR_VERIFYING_JWT`,
        401,
        error
      );
    }
  };

  const verifyBasicAuthMiddlewareBefore = (request: middy.Request) => {
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
