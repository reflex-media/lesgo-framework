import { LesgoException } from '../../exceptions';
import jwtConfig from '../../config/jwt';
const FILE = 'lesgo.services.JWTService.getJwtSecret';
const getJwtSecret = input => {
  var _a, _b;
  const jwtSecret = {
    keyid: input.keyid || '',
    secret: input.secret || '',
  };
  if (!input.secret) {
    jwtSecret.keyid =
      ((_a = jwtConfig.secrets[0]) === null || _a === void 0
        ? void 0
        : _a.keyid) || '';
    jwtSecret.secret =
      ((_b = jwtConfig.secrets[0]) === null || _b === void 0
        ? void 0
        : _b.secret) || '';
  }
  if (input.secret) {
    const foundSecret = jwtConfig.secrets.find(
      s => (s === null || s === void 0 ? void 0 : s.secret) === input.secret
    );
    if (!foundSecret) {
      throw new LesgoException(
        `No matching JWT Secret found.`,
        `${FILE}::SECRET_NOT_FOUND`
      );
    }
    jwtSecret.keyid = foundSecret.keyid;
    jwtSecret.secret = foundSecret.secret;
  }
  if (input.keyid) {
    const foundSecret = jwtConfig.secrets.find(
      s => (s === null || s === void 0 ? void 0 : s.keyid) === input.keyid
    );
    if (!foundSecret) {
      throw new LesgoException(
        `kid ${input.keyid} not found.`,
        `${FILE}::KID_NOT_FOUND`
      );
    }
    jwtSecret.keyid = foundSecret.keyid;
    jwtSecret.secret = foundSecret.secret;
  }
  if (!jwtSecret.secret) {
    throw new LesgoException(
      'Missing Secret to sign JWT',
      `${FILE}::SECRET_NOT_FOUND`
    );
  }
  return jwtSecret;
};
export default getJwtSecret;
