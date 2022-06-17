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
      allowDebug: () => true,
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
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
      allowDebug: () => true,
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

  it('should have null body even when enabled when configuration has is disabled', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
      allowDebug: () => true,
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
    app.debug = true;
  });

  it('should return no response when allowDebug overrides to return false via options', async () => {
    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
      allowDebug: () => true,
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
      allowDebug: () => false,
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
  });
});

describe('MiddlewareGroup: test errorHttpNoOutputResponseAfterHandler', () => {
  it('should have no body without debug', async () => {
    const handler = {
      response: {},
      event: {},
      allowDebug: () => true,
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
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
      allowDebug: () => true,
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

  it('should have null body even when enabled when configuration has is disabled', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
      allowDebug: () => true,
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
    app.debug = true;
  });

  it('should return no response when allowDebug overrides to return false via options', async () => {
    const handler = {
      response: {},
      event: {
        queryStringParameters: {
          debug: '1',
        },
        someEventKey: 'someEventValue',
      },
      allowDebug: () => true,
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
      allowDebug: () => false,
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
  });
});
