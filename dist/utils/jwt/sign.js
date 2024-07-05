Object.defineProperty(exports, '__esModule', { value: true });
// @ts-ignore
const jwt_1 = require('config/jwt');
const sign_1 = require('../../services/JWTService/sign');
const sign = (payload, secret = '', opts = {}) => {
  let secretKey = secret;
  if (!secretKey) {
    secretKey = jwt_1.default.secret;
  }
  let options = Object.assign({}, opts);
  if (!opts.expiresIn) {
    options = Object.assign(Object.assign({}, options), { expiresIn: '1h' });
  }
  const token = (0, sign_1.default)(payload, secretKey, options);
  return token;
};
exports.default = sign;
