const dataApiClient = jest.fn().mockImplementation(opts => {
  return {
    query: jest.fn().mockImplementation((sql, sqlParams) => {
      if (sql === 'SELECT_QUERY') {
        return Promise.resolve({
          records: [
            {
              id: 1,
              uid: 'some-uid-1',
            },
            {
              id: 2,
              uid: 'some-uid-2',
            },
          ],
        });
      }

      if (sql === 'INSERT_QUERY') {
        return Promise.resolve({
          numberOfRecordsUpdated: 1,
          insertId: 20,
        });
      }

      if (sql === 'UPDATE_QUERY') {
        return Promise.resolve({
          numberOfRecordsUpdated: 1,
        });
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
        return Promise.resolve({
          numberOfRecordsUpdated: 0,
          insertId: 0,
        });
      }

      if (sql === 'INVALID_UPDATE_QUERY') {
        return Promise.resolve({
          numberOfRecordsUpdated: 0,
        });
      }

      return Promise.resolve({});
    }),
    mocked: {
      ...opts,
    },
  };
});

export default dataApiClient;
