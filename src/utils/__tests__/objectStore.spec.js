import objectStore, { getObject } from '../objectStore';
import LesgoException from '../../exceptions/LesgoException';

describe('UtilsGroup: test objectStore utils', () => {
  it('test objectStore.getObject', () => {
    return expect(
      // eslint-disable-next-line import/no-named-as-default-member
      objectStore.getObject('someKey', 'someBucket')
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

  it('test objectStore getObject', () => {
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
      mocked: {
        opts: {},
        params: {
          Key: 'someKey',
          Bucket: 'someBucket',
        },
      },
    });
  });

  it('test objectStore getObject with empty key', () => {
    return expect(() => getObject()).toThrow(
      new LesgoException(
        'Key is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_KEY_UNDEFINED'
      )
    );
  });

  it('test objectStore getObject with empty bucket', () => {
    return expect(() => getObject('someKey')).toThrow(
      new LesgoException(
        'Bucket is undefined in S3Service.getObject()',
        'S3SERVICE_GETOBJECT_BUCKET_UNDEFINED'
      )
    );
  });
});
