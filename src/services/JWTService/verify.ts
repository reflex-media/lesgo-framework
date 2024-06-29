import { verify as verifyToken, VerifyOptions } from 'jsonwebtoken';

const verify = (token: string, secret: string, opts: VerifyOptions = {}) => {
  const decoded = verifyToken(token, secret, opts);
  return decoded;
};

export default verify;
