import os from '../opensearch';

// TODO we'll need to add more expected response

describe('UtilsGroup: test elasticsearch utils', () => {
  it('test creating index', async () => {
    await expect(
      os().createIndices({
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
          index: 'lesgo',
        },
      },
    });

    // test singleton instance
    await expect(
      os().createIndices({
        number_of_shards: 4,
        number_of_replicas: 5,
      })
    ).resolves.toMatchObject({
      data: {},
      mocked: {
        params: {
          body: {
            number_of_shards: 4,
            number_of_replicas: 5,
          },
        },
      },
    });
  });
});
