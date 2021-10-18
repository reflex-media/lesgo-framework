const mysql = {
  createConnection: jest.fn().mockImplementation(opts => {
    return Promise.resolve({
      config: {
        namedPlaceholders: jest.fn(),
      },
      execute: jest.fn().mockImplementation((sql, sqlParams) => {
        if (sql.startsWith('SELECT_QUERY')) {
          return Promise.resolve([
            [
              {
                id: 1,
                uid: 'some-uid-1',
              },
              {
                id: 2,
                uid: 'some-uid-2',
              },
            ],
            [],
          ]);
        }

        if (sql === 'INSERT_QUERY') {
          return Promise.resolve([
            {
              affectedRows: 1,
              insertId: 20,
            },
          ]);
        }

        if (sql === 'UPDATE_QUERY') {
          return Promise.resolve([
            {
              changedRows: 1,
            },
          ]);
        }

        if (sql === 'INVALID_QUERY') {
          return Promise.reject(
            new Error({
              code: 'BadRequestException',
            })
          );
        }

        if (sqlParams === 'INVALID_QUERY_PARAMETERS') {
          return Promise.reject(
            new Error({
              code: 'BadRequestException',
            })
          );
        }

        if (sql === 'INVALID_INSERT_QUERY') {
          return Promise.resolve([
            {
              affectedRows: 0,
              insertId: 0,
            },
          ]);
        }

        if (sql === 'INVALID_UPDATE_QUERY') {
          return Promise.resolve([
            {
              changedRows: 0,
            },
          ]);
        }

        return Promise.resolve([[], []]);
      }),
      end: jest.fn(),
      mocked: {
        ...opts,
      },
    });
  }),
};

export default mysql;
