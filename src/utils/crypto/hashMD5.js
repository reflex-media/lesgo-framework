import crypto from 'crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

export default data => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hashMD5',
      'CRYPTO_HASHMD5_EMPTY_PARAMETER'
    );
  }

  const hashedValue = crypto.createHash('md5').update(data).digest('hex');
  return hashedValue;
};
