import { Algorithm } from 'jsonwebtoken';
import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import signService from '../../services/JWTService/sign';
import isEmpty from '../isEmpty';
import generateUid from '../generateUid';

const FILE = 'lesgo.utils.jwt.sign';

const sign = (
  payload: any,
  {
    secret = '',
    opts = {},
  }: {
    secret?: string;
    opts?: {
      keyid?: string;
      algorithm?: Algorithm | string;
      expiresIn?: string;
      issuer?: string;
      audience?: string;
      subject?: string;
    };
  } = {
    secret: '',
    opts: {},
  }
): string => {
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
    expiresIn: string;
    issuer: string;
    audience: string;
    jwtid: string;
    subject: string;
    keyid?: string;
  } = {
    algorithm: (opts?.algorithm || config.algorithm || 'HS256') as Algorithm,
    expiresIn: opts?.expiresIn || config.expiresIn || '1h',
    issuer: opts?.issuer || config.issuer || 'lesgo',
    audience: opts?.audience || config.audience || 'lesgo',
    jwtid: generateUid({ length: 16 }),
    subject: opts?.subject || '',
  };

  if (!isEmpty(kid)) {
    options = {
      ...options,
      keyid: kid,
    };
  }

  const token: string = signService(payload, secret, options);
  return token;
};

export default sign;
