import { verify as verifyToken } from 'jsonwebtoken';
import jwtConfig from '../../config/jwt';
import { LesgoException } from '../../exceptions';
import { isEmpty, logger } from '../../utils';
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
  const validateClaims = !isEmpty(
    opts === null || opts === void 0 ? void 0 : opts.validateClaims
  )
    ? opts === null || opts === void 0
      ? void 0
      : opts.validateClaims
    : jwtConfig.validateClaims;
  if (validateClaims) {
    opts = Object.assign(
      {
        issuer:
          (opts === null || opts === void 0 ? void 0 : opts.issuer) ||
          jwtConfig.issuer,
        audience:
          (opts === null || opts === void 0 ? void 0 : opts.audience) ||
          jwtConfig.audience,
      },
      opts
    );
  }
  opts = Object.assign({ complete: true }, opts);
  try {
    logger.debug(`${FILE}::VERIFYING_TOKEN`, {
      token,
      opts,
      isValidateClaims: validateClaims,
    });
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
