Object.defineProperty(exports, '__esModule', { value: true });
const isDecimal = number =>
  typeof number !== 'string' && number.toString().indexOf('.') !== -1;
exports.default = isDecimal;
