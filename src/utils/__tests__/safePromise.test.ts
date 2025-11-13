import safePromise from '../safePromise';

describe('safePromise', () => {
  it('should return [null, data] when promise resolves with a value', async () => {
    const mockData = { message: 'Success' };
    const promise = Promise.resolve(mockData);

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toEqual(mockData);
  });

  it('should return [null, data] when promise resolves with a primitive value', async () => {
    const promise = Promise.resolve('test string');

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toBe('test string');
  });

  it('should return [null, data] when promise resolves with a number', async () => {
    const promise = Promise.resolve(42);

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toBe(42);
  });

  it('should return [null, data] when promise resolves with null', async () => {
    const promise = Promise.resolve(null);

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toBeNull();
  });

  it('should return [null, data] when promise resolves with undefined', async () => {
    const promise = Promise.resolve(undefined);

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toBeUndefined();
  });

  it('should return [err, null] when promise rejects with an Error', async () => {
    const mockError = new Error('Test error');
    const promise = Promise.reject(mockError);

    const [err, res] = await safePromise(promise);

    expect(err).toBe(mockError);
    expect(res).toBeNull();
  });

  it('should return [err, null] when promise rejects with a string', async () => {
    const mockError = 'String error';
    const promise = Promise.reject(mockError);

    const [err, res] = await safePromise(promise);

    expect(err).toBe(mockError);
    expect(res).toBeNull();
  });

  it('should return [err, null] when promise rejects with an object', async () => {
    const mockError = { code: 'ERROR_CODE', message: 'Custom error' };
    const promise = Promise.reject(mockError);

    const [err, res] = await safePromise(promise);

    expect(err).toEqual(mockError);
    expect(res).toBeNull();
  });

  it('should return [err, null] when promise rejects with null', async () => {
    const promise = Promise.reject(null);

    const [err, res] = await safePromise(promise);

    expect(err).toBeNull();
    expect(res).toBeNull();
  });

  it('should handle async operations correctly', async () => {
    const asyncOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      return 'async result';
    };

    const [err, res] = await safePromise(asyncOperation());

    expect(err).toBeNull();
    expect(res).toBe('async result');
  });

  it('should handle async errors correctly', async () => {
    const asyncOperation = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      throw new Error('Async error');
    };

    const [err, res] = await safePromise(asyncOperation());

    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).toBe('Async error');
    expect(res).toBeNull();
  });
});
