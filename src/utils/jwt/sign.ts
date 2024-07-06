import config from '../../config/jwt';
import signService from '../../services/JWTService/sign';

const sign = (payload: any, secret = '', opts: any = {}): string => {
  let secretKey: string = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }

  let options: any = { ...opts };
  if (!opts.expiresIn) {
    options = {
      ...options,
      expiresIn: '1h',
    };
  }

  const token: string = signService(payload, secretKey, options);
  return token;
};

export default sign;
