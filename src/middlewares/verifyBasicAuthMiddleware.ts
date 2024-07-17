import middy from '@middy/core';
import logger from '../utils/logger';
import { LesgoException } from '../exceptions';
import { validateFields } from '../utils';
import basicAuthConfig from '../config/basicAuth';

const FILE = 'lesgo.middlewares.verifyBasicAuthMiddleware';

export interface VerifyBasicAuthMiddlewareOptions {
  debugMode?: boolean;
}

const verifyBasicAuthMiddleware = (
  options: VerifyBasicAuthMiddlewareOptions = {}
) => {
  let decoded;
  let input;

  const verifyBasicAuth = (basicAuth: string) => {
    try {
      if (basicAuth.includes('Basic')) {
        basicAuth = basicAuth.replace('Basic ', '');
      }

      decoded = Buffer.from(basicAuth, 'base64').toString('utf8');
    } catch (error: any) {
      throw new LesgoException(
        'Error decoding basic auth',
        `${FILE}::ERROR_DECODING_BASIC_AUTH`,
        401,
        error
      );
    }

    const [username, password] = decoded.split(':');
    logger.debug(`${FILE}::BASIC_AUTH_DECODED`, { username, password });

    try {
      input = validateFields({ username, password }, [
        { key: 'username', type: 'string', required: true },
        { key: 'password', type: 'string', required: true },
      ]);
    } catch (error: any) {
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

  const verifyBasicAuthMiddlewareBefore = (request: middy.Request) => {
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

  return {
    before: verifyBasicAuthMiddlewareBefore,
  };
};

export default verifyBasicAuthMiddleware;
