import typeSafePromise from '../typeSafePromise';

describe('typeSafePromise', () => {
  it('should return success with data when promise resolves', async () => {
    const mockData = { message: 'Success' };
    const promise = Promise.resolve(mockData);

    const result = await typeSafePromise(promise);

    expect(result).toEqual({
      success: true,
      data: mockData,
    });
  });

  it('should return failure with error when promise rejects', async () => {
    const mockError = new Error('Failure');
    const promise = Promise.reject(mockError);

    const result = await typeSafePromise(promise);

    expect(result).toEqual({
      success: false,
      error: mockError,
    });
  });
});
