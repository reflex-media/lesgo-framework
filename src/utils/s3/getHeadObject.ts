import getHeadObjectService, {
  HeadObjectOptions,
} from '../../services/S3Service/getHeadObject';
import { ClientOptions } from '../../types/aws';

const getHeadObject = async (
  key: string,
  opts?: HeadObjectOptions,
  clientOpts?: ClientOptions
) => {
  return getHeadObjectService(key, opts, clientOpts);
};

export default getHeadObject;
