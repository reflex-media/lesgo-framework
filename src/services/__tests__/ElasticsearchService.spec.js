import config from 'Config/elasticsearch'; // eslint-disable-line import/no-unresolved
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import ElasticsearchService from '../ElasticsearchService';

// TODO we'll need to add more expected response

describe('ServicesGroup: test ElasticsearchService', () => {
  it.each`
    client
    ${undefined}
    ${new ElasticsearchClient({})}
  `(
    'test instantiate default ElasticsearchService connection',
    ({ client }) => {
      const es = new ElasticsearchService({
        ...config.adapters.mocked,
        client,
      });
      expect(es.getClient()).toMatchObject({
        mocked: {
          conn: undefined,
        },
      });
    }
  );

  it('test search', () => {
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(es.search({ someKey: 'someValue' })).resolves.toMatchObject({
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
    const es = new ElasticsearchService(config.adapters.aws);
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

    return expect(es.msearch(params)).resolves.toMatchObject({
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
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(es.get(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test create', () => {
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(
      es.create(1, { someKey: 'someValue' })
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
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(
      es.indexOrCreateById({ id: 1, someKey: 'someValue' })
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
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(es.updateById(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test bulkIndex', () => {
    const es = new ElasticsearchService(config.adapters.aws);
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

    return expect(es.bulkIndex(bodies)).resolves.toMatchObject({
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
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(
      es.deleteIndices(config.adapters.aws.index)
    ).resolves.toMatchObject({
      mocked: {
        params: {
          index: config.adapters.aws.index,
        },
      },
    });
  });

  it('test existIndeces', () => {
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(
      es.existIndices(config.adapters.aws.index)
    ).resolves.toMatchObject({
      mocked: {
        params: {
          index: config.adapters.aws.index,
        },
      },
    });
  });

  it('test putMapping', () => {
    const es = new ElasticsearchService(config.adapters.aws);
    return expect(
      es.putMapping(config.adapters.aws.index, 'mockType', 'mockBody')
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
