import {
  errorHttpResponseHandler,
  errorHttpResponseAfterHandler,
} from '../errorHttpResponseMiddleware';
import ValidationErrorException from '../__mocks__/ValidationErrorException';

describe('MiddlewareGroup: test errorHandler middleware', () => {
  it('test with thrown Error', async () => {
    const data = await errorHttpResponseHandler({
      error: new Error('Test validation error'),
    });

    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(500);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'error');
    expect(dataBody).toHaveProperty('data', null);
    expect(dataBody).toHaveProperty('error');
    expect(dataBody).toHaveProperty('error.code', 'UNHANDLED_ERROR');
    expect(dataBody).toHaveProperty(
      'error.message',
      'Error: Test validation error'
    );
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('test with thrown custom Error with default parameters', async () => {
    const data = await errorHttpResponseHandler({
      error: new ValidationErrorException('Test validation error'),
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(400);

    expect(dataBody).toHaveProperty('error.code', 'VALIDATION_ERROR');
    expect(dataBody).toHaveProperty(
      'error.message',
      'ValidationError: Test validation error'
    );
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('test with formatSuccess argument', async () => {
    const data = await errorHttpResponseHandler({
      error: new ValidationErrorException('Test validation error'),
      formatError: options => {
        return options.error.code;
      },
    });

    expect(data.statusCode).toBe(400);

    expect(data.body).toBe('VALIDATION_ERROR');
  });

  it('test with thrown custom Error with given parameters', async () => {
    const data = await errorHttpResponseHandler({
      error: new ValidationErrorException(
        'Test validation error',
        'VALIDATION_ERROR_SAMPLE',
        401,
        {
          extraDataKey: 'extraDataValue',
        }
      ),
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(401);

    expect(dataBody).toHaveProperty('error.code', 'VALIDATION_ERROR_SAMPLE');
    expect(dataBody).toHaveProperty(
      'error.message',
      'ValidationError: Test validation error'
    );
    expect(dataBody).toHaveProperty('error.details', {
      extraDataKey: 'extraDataValue',
    });
  });

  it('test with error message', async () => {
    const data = await errorHttpResponseHandler({
      error: 'Test error message',
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(500);

    expect(dataBody).toHaveProperty('error.code', 'UNHANDLED_ERROR');
    expect(dataBody).toHaveProperty('error.message', 'Test error message');
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('test with error message with event', async () => {
    const data = await errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
      debugMode: true,
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(500);
    expect(dataBody).toHaveProperty('_meta', {
      someEventKey: 'someEventValue',
    });
  });

  it('test with error message with event in non-debug mode', async () => {
    const data = await errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(500);
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('test with undefined opts', async () => {
    const data = await errorHttpResponseHandler();

    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(500);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'error');
    expect(dataBody).toHaveProperty('data', null);
    expect(dataBody).toHaveProperty('error');
    expect(dataBody).toHaveProperty('error.code', 'UNHANDLED_ERROR');
    expect(dataBody).toHaveProperty('error.message', '');
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('should call db.end() whenever a db options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
      db: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });

  it('should call cache.end() whenever a cache options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
      cache: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });

  it('should call dbRead.end() whenever a dbRead options is set', async () => {
    const end = jest.fn().mockResolvedValue();
    await errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
      dbRead: {
        end,
      },
    });

    expect(end).toHaveBeenCalledTimes(1);
  });
});

describe('MiddlewareGroup: test errorHttpResponseAfterHandler', () => {
  it('test with default parameters', async () => {
    const handler = {
      error: {},
      event: {},
    };

    await errorHttpResponseAfterHandler(handler, () => {});
    expect(handler.response).toHaveProperty('statusCode', 500);
  });
});
