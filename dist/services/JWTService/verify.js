import { verify as verifyToken } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import { LesgoException } from '../../exceptions';
import { logger } from '../../utils';
import getJwtSecret from './getJwtSecret';
import decodeJwt from './decodeJwt';
const FILE = 'lesgo.services.JWTService.verify';
const verify = (token, secret, opts) => {
  const { header, payload, signature } = decodeJwt(token);
  logger.debug(`${FILE}::DECODED_JWT`, { header, payload, signature });
  const jwtSecret = getJwtSecret({
    secret,
    keyid:
      payload.kid ||
      header.kid ||
      (opts === null || opts === void 0 ? void 0 : opts.keyid),
  });
  const validateClaims =
    (opts === null || opts === void 0 ? void 0 : opts.validateClaims) ||
    jwtConfig.validateClaims;
  if (validateClaims) {
    opts = Object.assign(Object.assign({}, opts), {
      issuer:
        (opts === null || opts === void 0 ? void 0 : opts.issuer) ||
        jwtConfig.issuer,
      audience:
        (opts === null || opts === void 0 ? void 0 : opts.audience) ||
        jwtConfig.audience,
    });
  }
  try {
    const decoded = verifyToken(token, jwtSecret, opts);
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
