Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = require('jsonwebtoken');
const verify = (token, secret, opts = {}) => {
  const decoded = (0, jsonwebtoken_1.verify)(token, secret, opts);
  return decoded;
};
exports.default = verify;
