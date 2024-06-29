// @ts-ignore
import config from 'config/jwt';
import sign from '../../services/JWTService/sign';

export default (payload: any, secret = '', opts: any = {}): string => {
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

  const token: string = sign(payload, secretKey, options);
  return token;
};
