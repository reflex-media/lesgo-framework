// @ts-ignore
import config from 'config/jwt';
import verify from '../../services/JWTService/verify';

export default (token: string, secret = '', opts: any = {}): any => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = config.secret;
  }

  const decoded = verify(token, secretKey, opts);
  return decoded;
};
