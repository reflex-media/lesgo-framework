import jsonwebtoken from 'jsonwebtoken';

export default (token, secret, opts = {}) => {
  const decoded = jsonwebtoken.verify(token, secret, opts);
  return decoded;
};
