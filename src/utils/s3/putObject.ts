import putObjectService, {
  PutObjectOptions,
} from '../../services/S3Service/putObject';
import { ClientOptions } from '../../types/aws';

const putObject = async (
  key: string,
  file: Buffer | Uint8Array | Blob | string,
  opts?: PutObjectOptions,
  clientOpts?: ClientOptions
) => {
  return putObjectService(key, file, opts, clientOpts);
};

export default putObject;
