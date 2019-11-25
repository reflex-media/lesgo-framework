const Client = jest.fn().mockImplementation((opts, conn) => {
  return {
    indices: {
      create: jest.fn().mockImplementation((params, callback) => {
        return callback(null, {
          data: {},
          mocked: {
            params,
          },
        });
      }),
      delete: jest.fn().mockImplementation((params, callback) => {
        return callback(null, {
          data: {},
          mocked: {
            params,
          },
        });
      }),
      exists: jest.fn().mockImplementation((params, callback) => {
        return callback(null, {
          body: {
            mocked: {
              params,
            },
          },
        });
      }),
      putMapping: jest.fn().mockImplementation((params, callback) => {
        return callback(null, {
          mocked: {
            params,
          },
        });
      }),
    },
    search: jest.fn().mockImplementation((param, callback) => {
      return callback(null, {
        response: {},
        mocked: {
          param,
        },
      });
    }),
    get: jest.fn().mockImplementation((params, callback) => {
      return callback(null, {
        response: {},
        mocked: {
          params,
        },
      });
    }),
    index: jest.fn().mockImplementation((params, callback) => {
      return callback(null, {
        data: {},
        mocked: {
          params,
        },
      });
    }),
    bulk: jest.fn().mockImplementation((bodies, callback) => {
      return callback(null, {
        data: {},
        mocked: {
          bodies,
        },
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
