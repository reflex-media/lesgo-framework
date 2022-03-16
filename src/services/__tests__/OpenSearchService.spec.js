import config from 'Config/elasticsearch'; // eslint-disable-line import/no-unresolved
import OpenSearchService from '../opensearch/OpenSearchService';

// TODO we'll need to add more expected response

describe('ServicesGroup: test ElasticsearchService', () => {
  it('test instantiate default ElasticsearchService connection', () => {
    const os = new OpenSearchService(config.adapters.mocked);
    expect(os.getClient()).toMatchObject({
      mocked: {
        conn: undefined,
      },
    });
  });

  it('test search', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(os.search({ someKey: 'someValue' })).resolves.toMatchObject({
      mocked: {
        param: {
          body: {
            someKey: 'someValue',
          },
          index: 'lesgo',
          type: '_doc',
        },
      },
    });
  });

  it('test msearch', () => {
    const os = new OpenSearchService(config.adapters.aws);
    const params = [
      { index: config.adapters.aws.index },
      {
        query: {
          bool: {
            must: { id: 123 },
            must_not: { is_deleted: 1 },
          },
        },
      },
    ];

    return expect(os.msearch(params)).resolves.toMatchObject({
      mocked: {
        params: {
          body: [
            { index: config.adapters.aws.index },
            {
              query: {
                bool: {
                  must: { id: 123 },
                  must_not: { is_deleted: 1 },
                },
              },
            },
          ],
        },
      },
    });
  });

  it('test get', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(os.get(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test create', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(
      os.create(1, { someKey: 'someValue' })
    ).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
          body: {
            someKey: 'someValue',
          },
        },
      },
    });
  });

  it('test indexOrCreateById', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(
      os.indexOrCreateById({ id: 1, someKey: 'someValue' })
    ).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
          body: {
            someKey: 'someValue',
          },
        },
      },
    });
  });

  it('test updateById', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(os.updateById(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test bulkIndex', () => {
    const os = new OpenSearchService(config.adapters.aws);
    const bodies = [
      {
        profile_id: 1,
        someKey1: 'someValue1',
      },
      {
        profile_id: 2,
        someKey2: 'someValue2',
      },
    ];

    return expect(os.bulkIndex(bodies)).resolves.toMatchObject({
      mocked: {
        bodies: {
          body: [
            {
              index: {
                _id: 1,
              },
            },
            {
              profile_id: 1,
              someKey1: 'someValue1',
            },
            {
              index: {
                _id: 2,
              },
            },
            {
              profile_id: 2,
              someKey2: 'someValue2',
            },
          ],
        },
      },
    });
  });

  it('test deleteIndices', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(
      os.deleteIndices(config.adapters.aws.index)
    ).resolves.toMatchObject({
      mocked: {
        params: {
          index: config.adapters.aws.index,
        },
      },
    });
  });

  it('test existIndeces', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(
      os.existIndices(config.adapters.aws.index)
    ).resolves.toMatchObject({
      mocked: {
        params: {
          index: config.adapters.aws.index,
        },
      },
    });
  });

  it('test putMapping', () => {
    const os = new OpenSearchService(config.adapters.aws);
    return expect(
      os.putMapping(config.adapters.aws.index, 'mockType', 'mockBody')
    ).resolves.toMatchObject({
      mocked: {
        params: {
          index: config.adapters.aws.index,
          type: 'mockType',
          body: {
            properties: 'mockBody',
          },
        },
      },
    });
  });
});
