import verifyService, {
  VerifyInputOptions,
} from '../../services/JWTService/verify';
import logger from '../logger';

const FILE = 'lesgo.utils.jwt.verify';

const verify = (token: string, secret?: string, opts?: VerifyInputOptions) => {
  logger.debug(`${FILE}::REQUEST_RECEIVED`, { token, opts });
  if (token.includes('Bearer')) {
    token = token.replace('Bearer ', '');
  }

  const decoded = verifyService(token, secret, opts);
  return decoded;
};

export default verify;
