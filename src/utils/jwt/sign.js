import config from 'config/jwt';
import sign from '../../services/JWTService/sign';

export default (payload, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }

  let options = { ...opts };
  if (!opts.expiresIn) {
    options = {
      ...options,
      expiresIn: '1h',
    };
  }

  const token = sign(payload, secretKey, options);

  return token;
};
