import client from 'Config/client'; // eslint-disable-line import/no-unresolved
import crypto from 'crypto';
import LesgoException from '../exceptions/LesgoException';
import { errorHttpResponseAfterHandler } from './errorHttpResponseMiddleware';

const FILE = 'Middlewares/basicAuthMiddleware';

const blacklistMode = opts => {
  if (opts && typeof opts.blacklistMode !== 'undefined') {
    return !!opts.blacklistMode;
  }

  return true;
};

export const generateBasicAuthorizationHash = (key, secret) => {
  return crypto
    .createHash('sha1')
    .update(`${key}:${secret}`)
    .digest('hex');
};

const getSiteId = event => {
  let siteId;

  if (event.site && event.site.id) {
    siteId = event.site.id;
  } else if (
    event.requestContext &&
    event.requestContext.site &&
    event.requestContext.site.id
  ) {
    siteId = event.requestContext.site.id;
  } else if (event.platform) {
    siteId = event.platform;
  }

  if (typeof siteId === 'undefined') {
    throw new LesgoException(
      'Site ID could not be found',
      `${FILE}::SITE_ID_NOT_FOUND`,
      403,
      'Ensure that clientAuthMiddleware() is called before this Middleware'
    );
  }

  return siteId;
};

const getClient = opts => {
  if (opts && opts.client && Object.keys(opts.client).length > 0) {
    return opts.client;
  }

  return client;
};

const getHashFromHeaders = (headers, opts) => {
  const basicAuth = headers.Authorization;

  if (typeof basicAuth === 'undefined') {
    if (blacklistMode(opts)) {
      throw new LesgoException(
        'Authorization header not found',
        `${FILE}::AUTHORIZATION_HEADER_NOT_FOUND`,
        403,
        'Ensure you are have provided the basic authentication code using Authorization header'
      );
    }

    return '';
  }

  if (
    typeof basicAuth !== 'undefined' &&
    !basicAuth.startsWith('basic ') &&
    !basicAuth.startsWith('Basic ')
  ) {
    throw new LesgoException(
      'Invalid authorization type provided',
      `${FILE}::AUTH_INVALID_AUTHORIZATION_TYPE`,
      403,
      'Use the basic authorization method'
    );
  }

  const authEncoded = basicAuth.startsWith('basic ')
    ? basicAuth.replace('basic ', '')
    : basicAuth.replace('Basic ', '');

  if (authEncoded.length <= 0) {
    throw new LesgoException(
      'Empty basic authentication hash provided',
      `${FILE}::AUTH_EMPTY_BASIC_HASH`,
      403,
      'Ensure basic authentication has is provided along with the keyword "Basic"'
    );
  }

  const buff = Buffer.from(authEncoded, 'base64');

  return buff.toString('utf-8');
};

const validateBasicAuth = (hash, siteId, clientObject, opts) => {
  const site = Object.keys(clientObject).filter(clientCode => {
    const hashIsEquals =
      generateBasicAuthorizationHash(
        clientObject[clientCode].key,
        clientObject[clientCode].secret
      ) === hash;

    return siteId === clientCode && hashIsEquals;
  });

  if (
    site.length <= 0 &&
    (hash.length > 0 || (hash.length <= 0 && blacklistMode(opts)))
  ) {
    throw new LesgoException(
      'Invalid client key or secret provided',
      `${FILE}::AUTH_INVALID_CLIENT_OR_SECRET_KEY`,
      403,
      'Ensure you are using the correct client key or secret key provided'
    );
  }
};

export const verifyBasicAuthBeforeHandler = (handler, next, opts) => {
  const siteId = getSiteId(handler.event);
  const finalClient = getClient(opts);
  const hashFromHeader = getHashFromHeaders(handler.event.headers, opts);

  validateBasicAuth(hashFromHeader, siteId, finalClient, opts);

  next();
};

/* istanbul ignore next */
const basicAuthMiddleware = opts => {
  return {
    before: (handler, next) =>
      verifyBasicAuthBeforeHandler(handler, next, opts),
    onError: (handler, next) => errorHttpResponseAfterHandler(handler, next),
  };
};

export default basicAuthMiddleware;
