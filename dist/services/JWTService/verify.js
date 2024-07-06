import { verify as verifyToken } from 'jsonwebtoken';
const verify = (token, secret, opts = {}) => {
  const decoded = verifyToken(token, secret, opts);
  return decoded;
};
export default verify;
