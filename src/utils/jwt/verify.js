import config from 'config/jwt';
import verify from '../../services/JWTService/verify';

export default (token, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }

  const decoded = verify(token, secretKey, opts);
  return decoded;
};
