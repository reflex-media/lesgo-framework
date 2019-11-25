import config from 'Config/elasticSearch'; // eslint-disable-line import/no-unresolved
import ElasticSearchService from '../ElasticSearchService';

// TODO we'll need to add more expected response

describe('ServicesGroup: test ElasticSearchService', () => {
  it('test instantiate default ElasticSearchService connection', () => {
    const es = new ElasticSearchService(config.adapters.mocked);
    expect(es.getClient()).toMatchObject({
      mocked: {
        conn: undefined,
      },
    });
  });

  it('test search', () => {
    const es = new ElasticSearchService(config.adapters.aws);
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

  it('test get', () => {
    const es = new ElasticSearchService(config.adapters.aws);
    return expect(es.get(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test create', () => {
    const es = new ElasticSearchService(config.adapters.aws);
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
    const es = new ElasticSearchService(config.adapters.aws);
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
    const es = new ElasticSearchService(config.adapters.aws);
    return expect(es.updateById(1)).resolves.toMatchObject({
      mocked: {
        params: {
          id: 1,
        },
      },
    });
  });

  it('test bulkIndex', () => {
    const es = new ElasticSearchService(config.adapters.aws);
    const bodies = [
      {
        id: 1,
        someKey1: 'someValue1',
      },
      {
        id: 2,
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
              id: 1,
              someKey1: 'someValue1',
            },
            {
              index: {
                _id: 2,
              },
            },
            {
              id: 2,
              someKey2: 'someValue2',
            },
          ],
        },
      },
    });
  });
});
