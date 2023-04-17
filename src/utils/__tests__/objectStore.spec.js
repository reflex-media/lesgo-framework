import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { getObject } from '../objectStore';
import LesgoException from '../../exceptions/LesgoException';

const s3Mock = mockClient(S3Client);

describe('UtilsGroup: test objectStore utils', () => {
  it('test s3.getObject', () => {
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

    return expect(getObject('someKey', 'someBucket')).resolves.toMatchObject({
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

  it('test objectStore getObject with empty key', () => {
    return expect(getObject()).rejects.toThrow(
      new LesgoException(
        'Key is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_KEY_UNDEFINED'
      )
    );
  });

  it('test objectStore getObject with empty bucket', () => {
    return expect(getObject('someKey')).rejects.toThrow(
      new LesgoException(
        'Bucket is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_BUCKET_UNDEFINED'
      )
    );
  });
});
