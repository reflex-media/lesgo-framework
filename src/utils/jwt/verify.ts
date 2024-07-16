import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
import isEmpty from '../isEmpty';
import logger from '../logger';
import { JwtHeader, JwtPayload } from 'jsonwebtoken';

const FILE = 'lesgo.utils.jwt.verify';

const decodeJwt = (token: string) => {
  const parts = token.split('.');

  return {
    header: JSON.parse(
      Buffer.from(parts[0], 'base64').toString('utf8')
    ) as JwtHeader,
    payload: JSON.parse(
      Buffer.from(parts[1], 'base64').toString('utf8')
    ) as JwtPayload,
    signature: parts[2],
  };
};

const verify = (
  token: string,
  {
    secret,
    opts,
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
  logger.debug(`${FILE}::REQUEST_RECEIVED`, { token, secret, opts });
  if (token.includes('Bearer')) {
    token = token.replace('Bearer ', '');
  }

  const { header, payload, signature } = decodeJwt(token);
  logger.debug(`${FILE}::DECODED_JWT`, { header, payload, signature });

  const kid = opts?.keyid || payload.kid || header.kid || '';
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
    algorithm: (opts?.algorithm ||
      header.alg ||
      config.algorithm ||
      'HS256') as Algorithm,
  };

  let validateClaims = config.validateClaims;
  if (typeof opts?.validateClaims !== 'undefined') {
    validateClaims = opts.validateClaims;
  }

  if (validateClaims) {
    options = {
      ...options,
      issuer: opts?.issuer || config.issuer || 'lesgo',
      audience: opts?.audience || config.audience || 'lesgo',
    };
  }

  logger.debug(`${FILE}::OPTIONS`, { options, kid });
  const decoded = verifyService(token, secret, options);
  return decoded;
};

export default verify;
