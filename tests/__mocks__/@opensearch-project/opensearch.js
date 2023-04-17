const Client = {
  indices: {
    create: jest.fn().mockImplementation(params => {
      return Promise.resolve({
        body: {
          acknowledged: true,
          shards_acknowledged: true,
          index: 'lesgo',
        },
        statusCode: 200,
        headers: {
          date: 'Mon, 17 Apr 2023 03:57:14 GMT',
          'content-type': 'application/json; charset=UTF-8',
          'content-length': '64',
          connection: 'keep-alive',
          'access-control-allow-origin': '*',
        },
        mocked: {
          params,
        },
      });
    }),
  },
};

export default { Client };
