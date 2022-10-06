import app from 'Config/app'; // eslint-disable-line import/no-unresolved
import {
  successHttpNoOutputResponseAfterHandler,
  errorHttpNoOutputResponseAfterHandler,
} from '../httpNoOutputMiddleware';

describe('MiddlewareGroup: test successHttpNoOutputResponseAfterHandler', () => {
  it('should have no body without debug', async () => {
    const handler = {
      response: {},
      event: {},
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', '');
  });

  it('should return the body when debug is enabled via query string parameters', async () => {
    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty(
      'body',
      JSON.stringify({
        status: 'success',
        data: 'Some message',
        _meta: {},
      })
    );
  });

  it('should have empty body even when enabled when configuration has is disabled', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', '');
    app.debug = true;
  });

  it.each`
    debug    | allowResponse  | body
    ${false} | ${() => true}  | ${JSON.stringify({ status: 'success', data: 'Some message', _meta: {} })}
    ${true}  | ${() => true}  | ${JSON.stringify({ status: 'success', data: 'Some message', _meta: {} })}
    ${false} | ${() => false} | ${''}
    ${true}  | ${() => false} | ${''}
    ${true}  | ${undefined}   | ${JSON.stringify({ status: 'success', data: 'Some message', _meta: {} })}
    ${false} | ${undefined}   | ${''}
  `(
    'should return a specific response when allowResponse is $allowResponse and debug is $debug passed via options',
    async ({ debug, allowResponse, body }) => {
      app.debug = debug;

      const handler = {
        response: {},
        event: {
          someEventKey: 'someEventValue',
          queryStringParameters: {
            debug: 1,
          },
        },
      };

      await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
        response: 'Some message',
        allowResponse,
      });
      expect(handler.response).toHaveProperty('statusCode', 200);
      expect(handler.response).toHaveProperty('body', body);

      app.debug = true;
    }
  );
});

describe('MiddlewareGroup: test errorHttpNoOutputResponseAfterHandler', () => {
  it('should have no body without debug', async () => {
    const handler = {
      response: {},
      event: {},
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', '');
  });

  it('should return the body when debug is enabled via query string parameters', async () => {
    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 500);
    expect(handler.response).toHaveProperty(
      'body',
      JSON.stringify({
        status: 'error',
        data: null,
        error: {
          code: 'UNHANDLED_ERROR',
          message: 'Error: Test validation error',
          details: '',
        },
        _meta: {
          queryStringParameters: {
            debug: '1',
          },
          someEventKey: 'someEventValue',
        },
      })
    );
  });

  it('should have empty body even when enabled when configuration has is disabled', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', '');
    app.debug = true;
  });

  it('should have a response when allowResponse override is passed via options', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
      allowResponse: () => true,
    });
    expect(handler.response).toHaveProperty('statusCode', 500);
    expect(JSON.parse(handler.response.body)).toStrictEqual({
      status: 'error',
      data: null,
      error: {
        code: 'UNHANDLED_ERROR',
        message: 'Error: Test validation error',
        details: '',
      },
      _meta: expect.anything(),
    });
  });
});
