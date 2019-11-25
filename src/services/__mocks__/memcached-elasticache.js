const Memcached = jest.fn().mockImplementation((url, options) => {
  return {
    set: jest.fn().mockImplementation((cacheKey, cacheData, cacheTime) => {
      return {
        mocked: {
          cacheKey,
          cacheData,
          cacheTime,
        },
      };
    }),
    get: jest.fn().mockImplementation(cacheKey => {
      return {
        mocked: {
          cacheKey,
        },
      };
    }),
    mocked: {
      url,
      options,
    },
  };
});

export default Memcached;
