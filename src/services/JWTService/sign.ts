import { sign as signJwt, SignOptions, Algorithm } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import { generateUid } from '../../utils';
import getJwtSecret from './getJwtSecret';

const sign = (payload: any, secret?: string, opts?: SignOptions) => {
  const options: SignOptions = {
    ...opts,
    algorithm: (opts?.algorithm || jwtConfig.algorithm) as Algorithm,
    expiresIn: opts?.expiresIn || jwtConfig.expiresIn,
    issuer: opts?.issuer || jwtConfig.issuer,
    audience: opts?.audience || jwtConfig.audience,
    jwtid: opts?.jwtid || generateUid({ length: 16 }),
  };

  const jwtSecret = getJwtSecret({ secret, keyid: options.keyid });

  const token = signJwt(payload, jwtSecret, options);
  return token;
};

export default sign;
