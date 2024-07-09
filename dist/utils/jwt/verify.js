import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
import isEmpty from '../isEmpty';
const FILE = 'lesgo.utils.jwt.verify';
const verify = (
  token,
  { secret = '', opts = {} } = {
    secret: '',
    opts: {},
  }
) => {
  var _a, _b;
  const kid = (opts === null || opts === void 0 ? void 0 : opts.keyid) || '';
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
  if (config.validateClaims) {
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
  const decoded = verifyService(token, secret, options);
  return decoded;
};
export default verify;
