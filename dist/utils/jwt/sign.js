import config from '../../config/jwt';
import signService from '../../services/JWTService/sign';
const sign = (payload, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }
  let options = Object.assign({}, opts);
  if (!opts.expiresIn) {
    options = Object.assign(Object.assign({}, options), { expiresIn: '1h' });
  }
  const token = signService(payload, secretKey, options);
  return token;
};
export default sign;
