import getObjectService, {
  GetObjectOptions,
  streamToBuffer,
} from '../../services/S3Service/getObject';
import { ClientOptions } from '../../types/aws';

const getObject = async (
  key: string,
  opts?: GetObjectOptions,
  clientOpts?: ClientOptions
) => {
  const { Body } = await getObjectService(key, opts, clientOpts);
  const objectBody = await streamToBuffer(Body);

  return objectBody;
};

export default getObject;
