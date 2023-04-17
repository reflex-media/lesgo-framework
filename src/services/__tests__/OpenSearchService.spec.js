import OpenSearchService from '../OpenSearchService';

const FILE = 'lesgo/services/OpenSearch';

describe('test OpenSearchService instantiation', () => {
  it('should be able to instantiate OpenSearchService', () => {
    const opensearch = new OpenSearchService({
      region: 'ap-southeast-1',
      host: 'localhost://',
    });

    expect(opensearch.opts).toMatchObject({
      region: 'ap-southeast-1',
      host: 'localhost://',
    });
  });

  it('should throw an error when instantiating OpenSearchService with missing region', () => {
    let err = {};
    try {
      expect(new OpenSearchService()).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Missing required parameter region');
      expect(err.code).toEqual(`${FILE}_MISSING_PARAMETER_REGION`);
    }
  });

  it('should throw an error when instantiating OpenSearchService with missing host', () => {
    let err = {};
    try {
      expect(new OpenSearchService({ region: 'ap-southeast-1' })).toThrow();
    } catch (e) {
      err = { ...e };
    } finally {
      expect(err.name).toEqual('LesgoException');
      expect(err.message).toEqual('Missing required parameter host');
      expect(err.code).toEqual(`${FILE}_MISSING_PARAMETER_HOST`);
    }
  });
});
