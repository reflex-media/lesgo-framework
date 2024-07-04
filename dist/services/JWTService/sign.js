Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = require('jsonwebtoken');
const sign = (payload, secret, opts = {}) => {
  const token = (0, jsonwebtoken_1.sign)(payload, secret, opts);
  return token;
};
exports.default = sign;
