import config from '../../config/jwt';
import verifyService from '../../services/JWTService/verify';

const verify = (token: string, secret = '', opts: any = {}): any => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }

  const decoded = verifyService(token, secretKey, opts);
  return decoded;
};

export default verify;
