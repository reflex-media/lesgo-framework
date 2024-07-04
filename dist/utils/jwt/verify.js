Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const jwt_1 = require('config/jwt');
const verify_1 = require('../../services/JWTService/verify');
exports.default = (token, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = jwt_1.default.secret;
  }
  const decoded = (0, verify_1.default)(token, secretKey, opts);
  return decoded;
};
