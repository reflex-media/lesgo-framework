import {
  successHttpResponseHandler,
  successHttpResponseAfterHandler,
} from '../successHttpResponseMiddleware';

describe('MiddlewareGroup: test successHttpResponseHandler middleware', () => {
  it('test default without parameters', async () => {
    const data = await successHttpResponseHandler();

    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(200);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'success');
    expect(dataBody).toHaveProperty('data', '');
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('test default', async () => {
    const data = await successHttpResponseHandler({ response: 'Some message' });

    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(200);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'success');
    expect(dataBody).toHaveProperty('data', 'Some message');
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('test with status code and event', async () => {
    const data = await successHttpResponseHandler({
      response: 'Some message',
      statusCode: 201,
      event: {
        someEventKey: 'someEventValue',
      },
    });

    expect(data.statusCode).toBe(201);

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'success');
    expect(dataBody).toHaveProperty('data', 'Some message');
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('test with status code and event in debug mode', async () => {
    const data = await successHttpResponseHandler({
      response: 'Some message',
      statusCode: 201,
      event: {
        someEventKey: 'someEventValue',
      },
      debugMode: true,
    });

    expect(data.statusCode).toBe(201);

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'success');
    expect(dataBody).toHaveProperty('data', 'Some message');
    expect(dataBody).toHaveProperty('_meta', {
      someEventKey: 'someEventValue',
    });
  });

  it('test with formatSuccess argument', async () => {
    const data = await successHttpResponseHandler({
      response: 'Some message',
      formatSuccess: options => {
        return options.response;
      },
    });

    expect(data.statusCode).toBe(200);

    expect(data.body).toBe('Some message');
  });

  it('test with configurable header', async () => {
    const data = await successHttpResponseHandler({
      response: 'Some message',
      headers: {
        'Access-Control-Allow-Credentials': false,
        'X-Token-Id': 'token',
      },
    });

    expect(data.headers['Access-Control-Allow-Credentials']).toBe(false);
    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');
    expect(data.headers['X-Token-Id']).toBe('token');

    expect(data.statusCode).toBe(200);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'success');
    expect(dataBody).toHaveProperty('data', 'Some message');
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('should call db.end() whenever a db options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await successHttpResponseHandler({
      response: 'Some message',
      headers: {
        'Access-Control-Allow-Credentials': false,
        'X-Token-Id': 'token',
      },
      db: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });

  it('should call dbRead.end() whenever a dbRead options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await successHttpResponseHandler({
      response: 'Some message',
      headers: {
        'Access-Control-Allow-Credentials': false,
        'X-Token-Id': 'token',
      },
      dbRead: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });

  it('should call cache.end() whenever a cache options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await successHttpResponseHandler({
      response: 'Some message',
      headers: {
        'Access-Control-Allow-Credentials': false,
        'X-Token-Id': 'token',
      },
      cache: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe('MiddlewareGroup: test successHttpResponseAfterHandler', () => {
  it('test with default parameters', async () => {
    const handler = {
      response: {},
      event: {},
    };

    await successHttpResponseAfterHandler(handler, () => {});
    expect(handler.response).toHaveProperty('statusCode', 200);
  });
});
