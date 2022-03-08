import { cacheData as cachedData } from '../../src/utils/__tests__/cache.spec';

const MemcachePlus = jest.fn().mockImplementation(options => {
  return {
    set: jest.fn().mockImplementation(cacheKey => {
      if (cacheKey === 'mockException')
        return Promise.reject(new Error('mockedException'));

      return Promise.resolve();
    }),
    get: jest.fn().mockImplementation(cacheKey => {
      if (cacheKey === 'mockException')
        return Promise.reject(new Error('mockedException'));

      return Promise.resolve(cachedData);
    }),
    getMulti: jest.fn().mockImplementation(cacheKeys => {
      if (cacheKeys[0] === 'mockException')
        return Promise.reject(new Error('mockedException'));

      const resp = [
        {
          someData: [
            {
              someDataKey1: 'someDataValue1',
            },
            {
              someDataKey2: 'someDataValue2',
            },
          ],
        },
        'someValue2',
      ];

      return Promise.resolve(resp);
    }),
    delete: jest.fn().mockImplementation(cacheKey => {
      if (cacheKey === 'mockException')
        return Promise.reject(new Error('mockedException'));

      return Promise.resolve();
    }),
    deleteMulti: jest.fn().mockImplementation(cacheKeys => {
      if (cacheKeys[0] === 'mockException')
        return Promise.reject(new Error('mockedException'));

      return Promise.resolve();
    }),
    end: jest.fn().mockImplementation(() => {
      return Promise.resolve();
    }),
    disconnect: jest.fn().mockImplementation(() => {
      return Promise.resolve();
    }),
    mocked: {
      options,
    },
  };
});

export default MemcachePlus;
