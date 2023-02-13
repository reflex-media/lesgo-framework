import clientAuthMiddleware, {
  clientAuthMiddlewareBeforeHandler,
} from '../clientAuthMiddleware';

describe('test authMiddleware', () => {
  test('should return object', async () => {
    // eslint-disable-next-line no-unused-vars
    const result = clientAuthMiddleware();
    expect(result).toHaveProperty('before');
  });
});

const next = () => {};

describe('test clientMiddlewareBeforeHandler', () => {
  test('should throw LesgoException when invalid api key is provided', async () => {
    const handler = {
      event: {
        headers: {
          'X-Api-Key': '123',
        },
      },
    };

    try {
      expect(await clientAuthMiddlewareBeforeHandler(handler, next)).toThrow();
    } catch (error) {
      expect(error.name).toBe('LesgoException');
      expect(error.message).toBe("Missing required 'clientKey'");
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe(
        'Middlewares/clientAuthMiddleware::INVALID_AUTH_DATA'
      );
    }
  });

  test('should throw LesgoException when x-client-id is incorrect', async () => {
    const handler = {
      event: {
        headers: {
          'x-client-id': 'notexisting',
        },
      },
    };

    try {
      expect(await clientAuthMiddlewareBeforeHandler(handler, next)).toThrow();
    } catch (error) {
      expect(error.name).toBe('LesgoException');
      expect(error.message).toBe('Invalid ClientId provided');
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe(
        'Middlewares/clientAuthMiddleware::INVALID_CLIENT_ID'
      );
    }
  });

  test('should be able to validate from multiple header keys', async () => {
    const handler = {
      event: {
        headers: {
          'X-Client-Id': '1111-1111-1111-1111',
        },
      },
    };

    let hasError = false;

    try {
      await clientAuthMiddlewareBeforeHandler(handler, next);
    } catch (e) {
      hasError = e;
    }

    expect(hasError).toBe(false);
  });

  test('should allow getting from query string parameters', async () => {
    const handler = {
      event: {
        queryStringParameters: {
          'x-client-id': '1111-1111-1111-1111',
        },
      },
    };

    let hasError = false;

    try {
      await clientAuthMiddlewareBeforeHandler(handler, next);
    } catch (e) {
      hasError = e;
    }

    expect(hasError).toBe(false);
  });

  test('should return success with valid client id', async () => {
    const handler = {
      event: {
        headers: {
          'x-client-id': '1111-1111-1111-1111',
        },
      },
    };

    let hasError = false;

    try {
      await clientAuthMiddlewareBeforeHandler(handler, next);
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  test('should return success with valid client id on input', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    let hasError = false;

    try {
      await clientAuthMiddlewareBeforeHandler(handler, next);
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBe(false);
  });

  test('should set handler.event.platform with valid client id on input', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    let hasError = false;

    try {
      await clientAuthMiddlewareBeforeHandler(handler, next);
    } catch (e) {
      hasError = true;
    }

    expect(hasError).toBe(false);
    expect(handler.event.platform).toStrictEqual({
      id: 'platform_1',
      key: '1111-1111-1111-1111',
      secret: '1111-1111-1111-1111',
    });
  });

  test('should execute passed callback function', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    await clientAuthMiddlewareBeforeHandler(handler, next, h => {
      // eslint-disable-next-line no-param-reassign
      h.event.created_obj = 'created_obj';
    });

    expect(handler.event).toHaveProperty('created_obj');
  });

  test('should execute with callback function from config', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    await clientAuthMiddlewareBeforeHandler(handler, next);

    expect(handler.event).toHaveProperty('created_obj');
  });

  test('should execute passed opt object with async callback function', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    await clientAuthMiddlewareBeforeHandler(handler, next, {
      callback: async h => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // eslint-disable-next-line no-param-reassign
        h.event.created_obj_async = 'created_obj_async';
      },
    });

    expect(handler.event).toHaveProperty('created_obj_async');
  });

  test('should not execute passed opt object with callback function if not a function', async () => {
    const handler = {
      event: {
        headers: {},
        input: {
          clientid: '1111-1111-1111-1111',
        },
      },
    };

    await clientAuthMiddlewareBeforeHandler(handler, next, {
      callback: 'not_function',
    });

    expect(handler.event).not.toHaveProperty('created_obj');
  });
});
