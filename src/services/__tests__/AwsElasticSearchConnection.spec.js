import AwsElasticSearchConnection from '../aws/AwsElasticSearchConnection';

describe('ServicesGroup: test AwsElasticSearchConnection', () => {
  it('test getCredentials AwsElasticSearchConnection', () => {
    const conn = new AwsElasticSearchConnection();
    return expect(conn.getCredentials()).resolves.toMatchObject({
      mocked: {
        credentials: 'mockedCredentials',
      },
    });
  });
});
