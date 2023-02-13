import client from 'Config/client'; // eslint-disable-line import/no-unresolved
import LesgoException from '../exceptions/LesgoException';

const FILE = 'Middlewares/basicAuthMiddleware';

export const generateBasicAuthorizationHash = (key, secret, opts = {}) => {
  const { getPreHashString } = {
    ...client,
    ...opts,
  };
  const preHashString =
    typeof getPreHashString === 'function'
      ? getPreHashString(key, secret)
      : `${key}:${secret}`;

  return Buffer.from(preHashString).toString('base64');
};

const getClient = opts => {
  if (opts && opts.client && Object.keys(opts.client).length > 0) {
    return opts.client;
  }

  return client.clients;
};

const getHashFromHeaders = headers => {
  const basicAuth = headers.Authorization || headers.authorization;

  if (typeof basicAuth === 'undefined') {
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

  return authEncoded;
};

const validateBasicAuth = (hash, clientObject, opts, siteId = undefined) => {
  const site = Object.keys(clientObject).find(clientCode => {
    const hashIsEquals =
      generateBasicAuthorizationHash(
        clientObject[clientCode].key,
        clientObject[clientCode].secret,
        opts
      ) === hash;

    return siteId ? siteId === clientCode && hashIsEquals : hashIsEquals;
  });

  if (!site) {
    throw new LesgoException(
      'Invalid client key or secret provided',
      `${FILE}::AUTH_INVALID_CLIENT_OR_SECRET_KEY`,
      403,
      'Ensure you are using the correct client key or secret key provided'
    );
  }
};

export const verifyBasicAuthBeforeHandler = async (handler, next, opts) => {
  const { headers, platform } = handler.event;
  const finalClient = getClient(opts);
  const hashFromHeader = getHashFromHeaders(headers);
  let isAuthOptional = platform ? platform.isAuthOptional : false;
  if (isAuthOptional && typeof isAuthOptional.then === 'function') {
    isAuthOptional = await isAuthOptional;
  }

  if (hashFromHeader) {
    validateBasicAuth(
      hashFromHeader,
      finalClient,
      opts,
      platform ? platform.id : undefined
    );
  } else if (!platform || !isAuthOptional) {
    /**
     * An error will occur only when either the platform could not be determined, assuming a basic auth is needed.
     * Or whenever the platform could be determined, but `isAuthOptional` is not true for that platform
     */
    throw new LesgoException(
      'Authorization header not found',
      `${FILE}::AUTHORIZATION_HEADER_NOT_FOUND`,
      403,
      'Ensure you are have provided the basic authentication code using Authorization header'
    );
  }

  next();
};

/* istanbul ignore next */
const basicAuthMiddleware = opts => {
  return {
    before: (handler, next) =>
      verifyBasicAuthBeforeHandler(handler, next, opts),
  };
};

export default basicAuthMiddleware;
