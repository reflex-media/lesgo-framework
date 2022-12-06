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
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
    app.debug = true;
  });

  it('should return a response when allowResponse override is passed via options', async () => {
    app.debug = false;

    const handler = {
      response: {},
      event: {
        someEventKey: 'someEventValue',
      },
    };

    await successHttpNoOutputResponseAfterHandler(handler, () => {}, {
      response: 'Some message',
      allowResponse: () => true,
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

    app.debug = true;
  });
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
    };

    await errorHttpNoOutputResponseAfterHandler(handler, () => {}, {
      error: new Error('Test validation error'),
    });
    expect(handler.response).toHaveProperty('statusCode', 200);
    expect(handler.response).toHaveProperty('body', null);
    app.debug = true;
  });

  it('should return a response when allowResponse override is passed via options', async () => {
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
        _meta: {},
      })
    );

    app.debug = false;
  });
});
