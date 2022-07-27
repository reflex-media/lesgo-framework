import client from 'Config/client'; // eslint-disable-line import/no-unresolved
import validateFields from '../utils/validateFields';
import { LesgoException } from '../exceptions';

const FILE = 'Middlewares/clientAuthMiddleware';

const validateParams = params => {
  const validFields = [
    { key: 'clientKey', type: 'string', required: true },
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
  const foundExistingKey = client.headerKeys.find(headerKey => {
    if (event.headers && typeof event.headers[headerKey] === 'string') {
      return true;
    }

    if (
      event.queryStringParameters &&
      typeof event.queryStringParameters[headerKey] === 'string'
    ) {
      return true;
    }

    return false;
  });

  if (foundExistingKey) {
    if (event.headers && event.headers[foundExistingKey]) {
      return event.headers[foundExistingKey];
    }

    // There will always be one where this is found existing
    return event.queryStringParameters[foundExistingKey];
  }

  if (event.input && typeof event.input.clientid === 'string') {
    return event.input.clientid;
  }

  return undefined;
};

export const clientAuthMiddlewareBeforeHandler = async (
  handler,
  next,
  opt = {}
) => {
  const { clients, callback } = {
    ...client,
    ...(typeof opt === 'function' ? { callback: opt } : opt),
  };

  const { client: validatedClient, clientKey } = validateParams({
    clientKey: getClientKey(handler.event),
    client: clients,
  });

  const platform = Object.keys(validatedClient).filter(clientPlatform => {
    return validatedClient[clientPlatform].key === clientKey;
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

  if (typeof callback === 'function') {
    await callback(handler);
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
