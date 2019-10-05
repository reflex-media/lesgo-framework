import { S3 } from 'aws-sdk';

import S3Service from '../S3Service';

describe('ServicesGroup: test S3Service instantiation', () => {
  it('test instantiate default S3Service', () => {
    // eslint-disable-next-line no-unused-vars
    const s3Instance = new S3Service();

    expect(S3).toHaveBeenCalledWith({});
  });

  it('test instantiate S3Service with custom options', () => {
    // eslint-disable-next-line no-unused-vars
    const s3Instance = new S3Service({
      accessKeyId: 'aws.s3.options.accessKeyId',
      secretAccessKey: 'aws.s3.options.secretAccessKey',
      region: 'aws.s3.options.region',
    });

    expect(S3).toHaveBeenCalledWith({
      accessKeyId: 'aws.s3.options.accessKeyId',
      secretAccessKey: 'aws.s3.options.secretAccessKey',
      region: 'aws.s3.options.region',
    });
  });
});

describe('ServicesGroup: test S3Service usage', () => {
  it('test getObject', () => {
    // eslint-disable-next-line no-unused-vars
    const s3Instance = new S3Service();

    return expect(
      s3Instance.getObject('someKey', 'someBucket')
    ).resolves.toMatchObject({
      LastModified: '2019-09-04T05:00:57.000Z',
      ContentLength: 27892,
      ETag: '38e6c8a510f49edec0ad4244a7665312',
      ContentType: '.jpg',
      Metadata: {},
      Body: {
        type: 'Buffer',
        data: [],
      },
      mocked: {
        opts: {},
        params: {
          Key: 'someKey',
          Bucket: 'someBucket',
        },
      },
    });
  });
});
