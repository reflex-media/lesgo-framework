import {
  errorHttpResponseHandler,
  errorHttpResponseAfterHandler,
} from '../errorHttpResponse';
import ValidationErrorException from '../__mocks__/ValidationErrorException';

describe('test errorHandler middleware', () => {
  it('test with thrown Error', () => {
    const data = errorHttpResponseHandler({
      error: new Error('Test validation error'),
    });

    expect(data.headers['Access-Control-Allow-Credentials']).toBe(true);
    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(500);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'error');
    expect(dataBody).toHaveProperty('data', null);
    expect(dataBody).toHaveProperty('error');
    expect(dataBody).toHaveProperty('error.code', 'UNKNOWN_ERROR');
    expect(dataBody).toHaveProperty(
      'error.message',
      'Error: Test validation error'
    );
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('test with thrown custom Error with default parameters', () => {
    const data = errorHttpResponseHandler({
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

  it('test with thrown custom Error with given parameters', () => {
    const data = errorHttpResponseHandler({
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

  it('test with error message', () => {
    const data = errorHttpResponseHandler({ error: 'Test error message' });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(500);

    expect(dataBody).toHaveProperty('error.code', 'UNKNOWN_ERROR');
    expect(dataBody).toHaveProperty('error.message', 'Test error message');
    expect(dataBody).toHaveProperty('error.details', '');
  });

  it('test with error message with event', () => {
    const data = errorHttpResponseHandler({
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

  it('test with error message with event in non-debug mode', () => {
    const data = errorHttpResponseHandler({
      error: 'Test error message',
      event: {
        someEventKey: 'someEventValue',
      },
    });
    const dataBody = JSON.parse(data.body);

    expect(data.statusCode).toBe(500);
    expect(dataBody).toHaveProperty('_meta', {});
  });

  it('test with undefined opts', () => {
    const data = errorHttpResponseHandler();

    expect(data.headers['Access-Control-Allow-Credentials']).toBe(true);
    expect(data.headers['Access-Control-Allow-Origin']).toBe('*');
    expect(data.headers['Cache-Control']).toBe('no-cache');

    expect(data.statusCode).toBe(500);

    expect(typeof data.body).toBe('string');

    const dataBody = JSON.parse(data.body);
    expect(dataBody).toHaveProperty('status', 'error');
    expect(dataBody).toHaveProperty('data', null);
    expect(dataBody).toHaveProperty('error');
    expect(dataBody).toHaveProperty('error.code', 'UNKNOWN_ERROR');
    expect(dataBody).toHaveProperty('error.message', '');
    expect(dataBody).toHaveProperty('error.details', '');
  });
});

describe('test errorHttpResponseAfterHandler', () => {
  it('test with default parameters', () => {
    const handler = {
      error: {},
      event: {},
    };

    errorHttpResponseAfterHandler(handler, () => {});
    expect(handler.response).toHaveProperty('statusCode', 500);
  });
});
