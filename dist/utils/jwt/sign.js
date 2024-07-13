import { LesgoException } from '../../exceptions';
import config from '../../config/jwt';
import signService from '../../services/JWTService/sign';
import isEmpty from '../isEmpty';
import generateUid from '../generateUid';
const FILE = 'lesgo.utils.jwt.sign';
const sign = (
  payload,
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
    expiresIn:
      (opts === null || opts === void 0 ? void 0 : opts.expiresIn) ||
      config.expiresIn ||
      '1h',
    issuer:
      (opts === null || opts === void 0 ? void 0 : opts.issuer) ||
      config.issuer ||
      'lesgo',
    audience:
      (opts === null || opts === void 0 ? void 0 : opts.audience) ||
      config.audience ||
      'lesgo',
    jwtid: generateUid({ length: 16 }),
    subject: (opts === null || opts === void 0 ? void 0 : opts.subject) || '',
  };
  if (!isEmpty(kid)) {
    options = Object.assign(Object.assign({}, options), { keyid: kid });
  }
  const token = signService(payload, secret, options);
  return token;
};
export default sign;
