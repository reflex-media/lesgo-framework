import { verify as verifyToken, VerifyOptions } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import { LesgoException } from '../../exceptions';
import { logger } from '../../utils';
import getJwtSecret from './getJwtSecret';
import decodeJwt from './decodeJwt';

const FILE = 'lesgo.services.JWTService.verify';

export interface VerifyInputOptions extends VerifyOptions {
  validateClaims?: boolean;
  keyid?: string;
}

const verify = (token: string, secret?: string, opts?: VerifyInputOptions) => {
  const { header, payload, signature } = decodeJwt(token);
  logger.debug(`${FILE}::DECODED_JWT`, { header, payload, signature });

  const jwtSecret = getJwtSecret({
    secret,
    keyid: payload.kid || header.kid || opts?.keyid,
  });

  const validateClaims = opts?.validateClaims || jwtConfig.validateClaims;

  if (validateClaims) {
    opts = {
      issuer: opts?.issuer || jwtConfig.issuer,
      audience: opts?.audience || jwtConfig.audience,
      ...opts,
    };
  }

  opts = {
    complete: true,
    ...opts,
  };

  try {
    const decoded = verifyToken(token, jwtSecret.secret, opts);
    logger.debug(`${FILE}::VERIFIED_TOKEN`, decoded);
    return decoded;
  } catch (error) {
    throw new LesgoException(
      'Failed to verify token',
      `${FILE}::VERIFY_ERROR`,
      500,
      {
        error,
        token,
        opts,
      }
    );
  }
};

export default verify;
