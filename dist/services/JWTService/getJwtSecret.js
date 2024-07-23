import { LesgoException } from '../../exceptions';
import jwtConfig from '../../config/jwt';
const FILE = 'lesgo.services.JWTService.getJwtSecret';
const getJwtSecret = input => {
  var _a, _b;
  const { keyid } = input;
  let { secret } = input;
  if (!secret) {
    secret =
      (_a = jwtConfig.secrets[0]) === null || _a === void 0
        ? void 0
        : _a.secret;
  }
  if (keyid) {
    secret =
      (_b = jwtConfig.secrets.find(
        s => (s === null || s === void 0 ? void 0 : s.keyid) === keyid
      )) === null || _b === void 0
        ? void 0
        : _b.secret;
    if (!secret) {
      throw new LesgoException(
        `kid ${input.keyid} not found.`,
        `${FILE}::KID_NOT_FOUND`
      );
    }
  }
  if (!secret) {
    throw new LesgoException(
      'Missing Secret to sign JWT',
      `${FILE}::SECRET_NOT_FOUND`
    );
  }
  return secret;
};
export default getJwtSecret;
