import AwsElasticsearchConnection from '../aws/AwsElasticsearchConnection2';

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
