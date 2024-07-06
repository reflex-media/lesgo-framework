import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';
const verify = (token, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }
  const decoded = verifyService(token, secretKey, opts);
  return decoded;
};
export default verify;
