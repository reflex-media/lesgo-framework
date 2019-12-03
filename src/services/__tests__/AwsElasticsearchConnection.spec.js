import AWS from 'aws-sdk';
import { URL } from 'url';
import AwsElasticsearchConnection from '../aws/AwsElasticsearchConnection';

const commonConn = new AwsElasticsearchConnection();

describe('ServicesGroup: test AwsElasticsearchConnection Credentails', () => {
  it('test getCredentials AwsElasticsearchConnection', async () => {
    await expect(commonConn.getCredentials()).resolves.toMatchObject({
      mocked: {
        credentials: 'mockedCredentials',
      },
    });
  });

  it('test getCredentails and throws rejects promise', async () => {
    const oldConfig = AWS.config;

    AWS.config = {
      ...AWS.config,
      getCredentials: jest.fn().mockImplementation(callback => {
        return callback(
          {
            mocked: {
              error: 'mockedError',
            },
          },
          null
        );
      }),
    };

    await expect(commonConn.getCredentials()).rejects.toMatchObject({
      mocked: {
        error: 'mockedError',
      },
    });

    // return it back the old config
    AWS.config = oldConfig;
  });

  it('should throw error if credential is empty', async () => {
    const oldConfig = AWS.config.credentials;
    AWS.config.credentials = null;

    await expect(commonConn.getCredentials()).rejects.toThrow(
      new Error('Invalid AWS Credentials')
    );

    // return it back the old config
    AWS.config.credentials = oldConfig;
  });
});

describe('ServicesGroup: test AwsElasticsearchConnection Request', () => {
  it('should call the request method', async () => {
    const conn = new AwsElasticsearchConnection({
      awsRegion: 'us-east-1',
      url: new URL('http://localhost:9090'),
    });

    conn.request({}, () => {});
  });

  it('should call the request method and throw awsRegion Error', async () => {
    const conn = new AwsElasticsearchConnection({
      awsRegion: null,
    });

    await conn.request({}, err => {
      return expect(err).toMatchObject({
        message: 'Please provide the awsRegion!',
      });
    });
  });
});
