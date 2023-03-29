const Client = jest.fn().mockImplementation((opts, conn) => {
  return {
    indices: {
      create: jest.fn().mockImplementation(params => {
        return new Promise(resolve => {
          resolve({
            data: {},
            mocked: {
              params,
            },
          });
        });
      }),
      delete: jest.fn().mockImplementation(params => {
        return new Promise(resolve => {
          resolve({
            data: {},
            mocked: {
              params,
            },
          });
        });
      }),
      exists: jest.fn().mockImplementation(params => {
        return new Promise(resolve => {
          resolve({
            body: {
              mocked: {
                params,
              },
            },
          });
        });
      }),
      putMapping: jest.fn().mockImplementation(params => {
        return new Promise(resolve => {
          resolve({
            mocked: {
              params,
            },
          });
        });
      }),
    },
    search: jest.fn().mockImplementation(param => {
      return new Promise(resolve => {
        resolve({
          response: {},
          mocked: {
            param,
          },
        });
      });
    }),
    get: jest.fn().mockImplementation(params => {
      return new Promise(resolve => {
        resolve({
          response: {},
          mocked: {
            params,
          },
        });
      });
    }),
    msearch: jest.fn().mockImplementation(params => {
      return new Promise(resolve => {
        resolve({
          response: {},
          mocked: {
            params,
          },
        });
      });
    }),
    index: jest.fn().mockImplementation(params => {
      return new Promise(resolve => {
        resolve({
          data: {},
          mocked: {
            params,
          },
        });
      });
    }),
    bulk: jest.fn().mockImplementation(bodies => {
      return new Promise(resolve => {
        resolve({
          data: {},
          mocked: {
            bodies,
          },
        });
      });
    }),
    mocked: {
      opts,
      conn,
    },
  };
});

const Connection = jest.fn().mockImplementation(() => {});

export { Client, Connection };
export default { Client, Connection };
