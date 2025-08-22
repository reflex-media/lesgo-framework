import { sign as signJwt } from 'jsonwebtoken';
import { jwt as jwtConfig } from '../../config';
import { generateUid } from '../../utils';
import getJwtSecret from './getJwtSecret';
const sign = (payload, secret, opts) => {
  var _a;
  const jwtSecret = getJwtSecret({
    secret,
    keyid: opts === null || opts === void 0 ? void 0 : opts.keyid,
  });
  const options = Object.assign(Object.assign({}, opts), {
    algorithm:
      (opts === null || opts === void 0 ? void 0 : opts.algorithm) ||
      jwtConfig.algorithm,
    expiresIn:
      (_a = opts === null || opts === void 0 ? void 0 : opts.expiresIn) !==
        null && _a !== void 0
        ? _a
        : jwtConfig.expiresIn,
    issuer:
      (opts === null || opts === void 0 ? void 0 : opts.issuer) ||
      jwtConfig.issuer,
    audience:
      (opts === null || opts === void 0 ? void 0 : opts.audience) ||
      jwtConfig.audience,
    jwtid:
      (opts === null || opts === void 0 ? void 0 : opts.jwtid) ||
      generateUid({ length: 16 }),
    keyid: jwtSecret.keyid,
  });
  const token = signJwt(payload, jwtSecret.secret, options);
  return token;
};
export default sign;
