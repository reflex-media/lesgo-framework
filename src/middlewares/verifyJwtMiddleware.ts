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

const verifyJwtMiddleware = (options: VerifyJwtOptions = {}) => {
  const verifyJwt = async (token: string, opts: VerifyJwtOptions) => {
    let payload;

    try {
      payload = verify(token, { secret: opts.secret, opts });
    } catch (error: any) {
      throw new LesgoException(
        'Error verifying JWT',
        `${FILE}::ERROR_VERIFYING_JWT`,
        401,
        error
      );
    }
  };

  const verifyJwtMiddlewareBefore = async (request: middy.Request) => {
    logger.debug(`${FILE}::JWT_TO_VERIFY`);
    const token = request.event.headers.Authorization;

    if (!token) {
      throw new LesgoException(
        'No token provided',
        `${FILE}::NO_TOKEN_PROVIDED`,
        401
      );
    }

    await verifyJwt(token, options);
    logger.debug(`${FILE}::JWT_VERIFIED`);
  };

  return {
    before: verifyJwtMiddlewareBefore,
  };
};

export default verifyJwtMiddleware;
