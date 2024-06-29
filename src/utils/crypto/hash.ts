// @ts-ignore
import crypto from 'crypto';
import LesgoException from '../../exceptions/LesgoException';
import isEmpty from '../isEmpty';

export default (data: string): string => {
  if (isEmpty(data)) {
    throw new LesgoException(
      'Empty parameter supplied on hash',
      'CRYPTO_HASH_EMPTY_PARAMETER'
    );
  }

  const hashedValue: string = crypto
    .createHash('sha256', 'utf8')
    .update(data)
    .digest('hex');

  return hashedValue;
};
