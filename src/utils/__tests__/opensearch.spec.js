import opensearch from '../opensearch';

describe('test opensearch utils', () => {
  it('should use default adapter', () => {
    const opensearchInstance = opensearch();
    expect(opensearchInstance.opts).toMatchObject({
      region: 'ap-southeast-1',
      host: '//localhost',
    });
  });

  it('should reuse the same singleton', () => {
    opensearch();
    const opensearchInstance2 = opensearch();

    expect(opensearchInstance2.opts).toMatchObject({
      region: 'ap-southeast-1',
      host: '//localhost',
    });
  });

  it('should use a different configured adapter', () => {
    const opensearchInstance = opensearch('mockCustom');
    expect(opensearchInstance.opts).toMatchObject({
      region: 'us-west-2',
      host: '//localhost-mocked',
    });
  });
});
