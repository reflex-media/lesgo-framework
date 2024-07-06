import { sign as signJwt } from 'jsonwebtoken';
const sign = (payload, secret, opts = {}) => {
  const token = signJwt(payload, secret, opts);
  return token;
};
export default sign;
