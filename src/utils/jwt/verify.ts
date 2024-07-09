import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
import isEmpty from '../isEmpty';
import logger from '../logger';

const FILE = 'lesgo.utils.jwt.verify';

const verify = (
  token: string,
  { secret = '', opts = {} }: { secret?: string; opts?: any } = {
    secret: '',
    opts: {},
  }
): any => {
  const kid = opts?.keyid || '';
  secret = secret || config.secrets[0]?.secret || '';

  if (!isEmpty(kid)) {
    secret = config.secrets.find(s => s.keyid === kid)?.secret || '';

    if (!secret) {
      throw new LesgoException(
        `${FILE}::KID_NOT_FOUND`,
        `kid ${kid} not found.`
      );
    }
  }

  let options: {
    algorithm: Algorithm;
    issuer?: string;
    audience?: string;
  } = {
    algorithm: (opts?.algorithm || config.algorithm || 'HS256') as Algorithm,
  };

  let validateClaims = config.validateClaims;
  if (typeof opts.validateClaims !== 'undefined') {
    validateClaims = opts.validateClaims !== 'false';
  }

  if (validateClaims) {
    options = {
      ...options,
      issuer: opts?.issuer || config.issuer || 'lesgo',
      audience: opts?.audience || config.audience || 'lesgo',
    };
  }

  logger.debug(`${FILE}::OPTIONS`, { options });
  const decoded = verifyService(token, secret, options);
  return decoded;
};

export default verify;
