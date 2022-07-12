import client from 'Config/client'; // eslint-disable-line import/no-unresolved
import validateFields from '../utils/validateFields';
import { LesgoException } from '../exceptions';

const FILE = 'Middlewares/clientAuthMiddleware';

const validateParams = params => {
  const validFields = [
    { key: 'x-client-id', type: 'string', required: true },
    { key: 'client', type: 'object', required: true },
  ];

  try {
    return validateFields(params, validFields);
  } catch (error) {
    throw new LesgoException(error.message, `${FILE}::INVALID_AUTH_DATA`, 403, {
      error,
    });
  }
};

const getClientKey = event => {
  if (typeof event.headers['x-client-id'] === 'string') {
    return event.headers['x-client-id'];
  }

  if (event.input && typeof event.input.clientid === 'string') {
    return event.input.clientid;
  }

  return undefined;
};

export const clientAuthMiddlewareBeforeHandler = (
  handler,
  next,
  opt = undefined
) => {
  const validated = validateParams({
    'x-client-id': getClientKey(handler.event),
    client,
  });

  const clientKey = validated['x-client-id'];

  const platform = Object.keys(validated.client).filter(clientPlatform => {
    return validated.client[clientPlatform].key === clientKey;
  });

  if (platform.length === 0) {
    throw new LesgoException(
      'Invalid ClientId provided',
      `${FILE}::INVALID_CLIENT_ID`,
      403,
      'Ensure you are using the correct Client Id provided'
    );
  }

  // eslint-disable-next-line no-param-reassign,prefer-destructuring
  handler.event.platform = platform[0];

  if (typeof opt === 'function') {
    opt(handler);
  } else if (typeof opt === 'object') {
    const { callback } = opt;
    if (typeof callback === 'function') callback(handler);
  }

  next();
};

/* istanbul ignore next */
const clientAuthMiddleware = opt => {
  return {
    before: (handler, next) =>
      clientAuthMiddlewareBeforeHandler(handler, next, opt),
  };
};

export default clientAuthMiddleware;
