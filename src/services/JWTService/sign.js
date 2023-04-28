import jsonwebtoken from 'jsonwebtoken';

export default (payload, secret, opts = {}) => {
  const token = jsonwebtoken.sign(payload, secret, opts);
  return token;
};
