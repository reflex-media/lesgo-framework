import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
import isEmpty from '../isEmpty';
import logger from '../logger';
const FILE = 'lesgo.utils.jwt.verify';
const decodeJwt = token => {
  const parts = token.split('.');
  return {
    header: JSON.parse(Buffer.from(parts[0], 'base64').toString('utf8')),
    payload: JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8')),
    signature: parts[2],
  };
};
const verify = (
  token,
  { secret = '', opts = {} } = {
    secret: '',
    opts: {},
  }
) => {
  var _a, _b;
  const { header, payload } = decodeJwt(token);
  const kid = opts.keyid || payload.kid || header.kid || '';
  secret =
    secret ||
    ((_a = config.secrets[0]) === null || _a === void 0 ? void 0 : _a.secret) ||
    '';
  if (!isEmpty(kid)) {
    secret =
      ((_b = config.secrets.find(s => s.keyid === kid)) === null ||
      _b === void 0
        ? void 0
        : _b.secret) || '';
    if (!secret) {
      throw new LesgoException(
        `${FILE}::KID_NOT_FOUND`,
        `kid ${kid} not found.`
      );
    }
  }
  let options = {
    algorithm:
      (opts === null || opts === void 0 ? void 0 : opts.algorithm) ||
      config.algorithm ||
      'HS256',
  };
  let validateClaims = config.validateClaims;
  if (typeof opts.validateClaims !== 'undefined') {
    validateClaims = opts.validateClaims;
  }
  if (validateClaims) {
    options = Object.assign(Object.assign({}, options), {
      issuer:
        (opts === null || opts === void 0 ? void 0 : opts.issuer) ||
        config.issuer ||
        'lesgo',
      audience:
        (opts === null || opts === void 0 ? void 0 : opts.audience) ||
        config.audience ||
        'lesgo',
    });
  }
  logger.debug(`${FILE}::OPTIONS`, { options });
  const decoded = verifyService(token, secret, options);
  return decoded;
};
export default verify;
