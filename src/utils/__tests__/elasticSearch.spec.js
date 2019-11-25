import es from '../elasticSearch';

// TODO we'll need to add more expected response

describe('UtilsGroup: test elasticSearch utils', () => {
  it('test creating index', () => {
    return expect(
      es().createIndices({
        number_of_shards: 3,
        number_of_replicas: 2,
      })
    ).resolves.toMatchObject({
      data: {},
      mocked: {
        params: {
          body: {
            number_of_shards: 3,
            number_of_replicas: 2,
          },
          include_type_name: true,
          index: 'lesgo',
        },
      },
    });
  });
});
