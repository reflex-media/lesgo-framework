import AwsElasticsearchConnection from '../aws/AwsElasticsearchConnection';

describe('ServicesGroup: test AwsElasticsearchConnection', () => {
  it('test getCredentials AwsElasticsearchConnection', () => {
    const conn = new AwsElasticsearchConnection();
    return expect(conn.getCredentials()).resolves.toMatchObject({
      mocked: {
        credentials: 'mockedCredentials',
      },
    });
  });
});
