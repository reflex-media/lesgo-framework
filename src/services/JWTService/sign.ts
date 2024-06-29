import { sign as signJwt, SignOptions } from 'jsonwebtoken';

const sign = (payload: any, secret: string, opts: SignOptions = {}): string => {
  const token = signJwt(payload, secret, opts);
  return token;
};

export default sign;
