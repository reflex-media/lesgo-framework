import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import LesgoException from '../../exceptions/LesgoException';
import S3Service from '../S3Service';

const s3Mock = mockClient(S3Client);

describe('ServicesGroup: test S3Service usage', () => {
  it('test getObject', () => {
    s3Mock.on(GetObjectCommand).resolves({
      LastModified: '2019-09-04T05:00:57.000Z',
      ContentLength: 27892,
      ETag: '38e6c8a510f49edec0ad4244a7665312',
      ContentType: '.jpg',
      Metadata: {},
      Body: {
        type: 'Buffer',
        data: [],
      },
    });

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
    });
  });

  it('test getObject to throw if missing key', () => {
    const s3Instance = new S3Service();

    return expect(
      s3Instance.getObject('', 'someBucket')
    ).rejects.toMatchObject(new LesgoException(
      'Key is undefined in S3Service.getObject()',
      'S3SERVICE_GETOBJECT_KEY_UNDEFINED'
    ));
  });

  it('test getObject to throw if missing bucket', () => {
    const s3Instance = new S3Service();

    return expect(
      s3Instance.getObject('someKey', '')
    ).rejects.toMatchObject(new LesgoException(
      'Bucket is undefined in S3Service.getObject()',
      'S3SERVICE_GETOBJECT_BUCKET_UNDEFINED'
    ));
  });

  it('test getObject thrown exception', () => {
    s3Mock.on(GetObjectCommand).rejects(
      new Error(
        'Some Error',
        'SOME_ERROR'
      )
    );

    const s3Instance = new S3Service();

    return expect(
      s3Instance.getObject('someKey', 'someBucket')
    ).rejects.toMatchObject(new LesgoException(
      'Error occured getting object from S3 bucket',
      'S3SERVICE_GETOBJECT_COMMAND_ERROR',
      500,
    ));
  });
});
