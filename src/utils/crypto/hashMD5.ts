// @ts-ignore
import crypto from 'crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

const hashMD5 = (data: string): string => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hashMD5',
      'CRYPTO_HASHMD5_EMPTY_PARAMETER'
    );
  }

  const hashedValue: string = crypto
    .createHash('md5')
    .update(data)
    .digest('hex');
  return hashedValue;
};

export default hashMD5;
