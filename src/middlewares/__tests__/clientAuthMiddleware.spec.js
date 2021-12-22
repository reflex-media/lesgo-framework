import clientAuthMiddleware, {
  clientAuthMiddlewareBeforeHandler,
} from '../clientAuthMiddleware';

describe('test authMiddleware', () => {
  test('should return object', async () => {
    const result = clientAuthMiddleware();
    expect(result).toHaveProperty('before');
    expect(result).toHaveProperty('onError');
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
      expect(error.message).toBe("Missing required 'x-client-id'");
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
});
