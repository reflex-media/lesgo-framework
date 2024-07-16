import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
import isEmpty from '../isEmpty';
import logger from '../logger';

const FILE = 'lesgo.utils.jwt.verify';

const decodeJwt = (token: string) => {
  const parts = token.split('.');

  return {
    header: JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')),
    signature: parts[2],
  };
};

const verify = (
  token: string,
  {
    secret = '',
    opts = {},
  }: {
    secret?: string;
    opts?: {
      keyid?: string;
      algorithm?: Algorithm | string;
      validateClaims?: boolean;
      issuer?: string;
      audience?: string;
    };
  } = {
    secret: '',
    opts: {},
  }
): any => {
  const { header, payload } = decodeJwt(token);

  const kid = opts.keyid || payload.kid || header.kid || '';
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
    validateClaims = opts.validateClaims;
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
