const Memcached = jest.fn().mockImplementation((url, options) => {
  let mockedCache = null;

  return {
    set: jest
      .fn()
      .mockImplementation((cacheKey, cacheData, cacheTime, callback) => {
        if (cacheKey === 'mockError') return callback('mockedError');
        if (cacheKey === 'mockException') throw new Error('mockedException');

        mockedCache = {
          [cacheKey]: {
            data: cacheData,
            lifetime: cacheTime,
          },
        };

        return callback(null, true);
      }),
    get: jest.fn().mockImplementation((cacheKey, callback) => {
      if (cacheKey === 'mockError') return callback('mockedError');
      if (cacheKey === 'mockException') throw new Error('mockedException');

      return callback(null, mockedCache[cacheKey]);
    }),
    del: jest.fn().mockImplementation((cacheKey, callback) => {
      if (cacheKey === 'mockError') return callback('mockedError');
      if (cacheKey === 'mockException') throw new Error('mockedException');

      mockedCache = { [cacheKey]: true };
      return callback(null, mockedCache[cacheKey]);
    }),
    end: jest.fn().mockImplementation(() => {}),
    mocked: {
      url,
      options,
    },
  };
});

export default Memcached;
