Object.defineProperty(exports, '__esModule', { value: true });
exports.getTokenData = void 0;
const isEmpty_1 = require('./isEmpty');
const getTokenData = authHeader => {
  try {
    return JSON.parse(
      Buffer.from(authHeader.split('.')[1], 'base64').toString()
    );
  } catch (err) {
    return {};
  }
};
exports.getTokenData = getTokenData;
const getJwtSubFromAuthHeader = authHeader => {
  if ((0, isEmpty_1.default)(authHeader)) {
    return null;
  }
  const data = (0, exports.getTokenData)(authHeader);
  return data.sub || null;
};
exports.default = getJwtSubFromAuthHeader;
