Object.defineProperty(exports, '__esModule', { value: true });
exports.validateFields =
  exports.logger =
  exports.isEmpty =
  exports.isEmail =
  exports.isDecimal =
  exports.getJwtSubFromAuthHeader =
  exports.getCurrentTimestamp =
    void 0;
const getCurrentTimestamp_1 = require('./getCurrentTimestamp');
const getJwtSubFromAuthHeader_1 = require('./getJwtSubFromAuthHeader');
const isDecimal_1 = require('./isDecimal');
const isEmail_1 = require('./isEmail');
const isEmpty_1 = require('./isEmpty');
const logger_1 = require('./logger');
var getCurrentTimestamp_2 = require('./getCurrentTimestamp');
Object.defineProperty(exports, 'getCurrentTimestamp', {
  enumerable: true,
  get: function () {
    return getCurrentTimestamp_2.default;
  },
});
var getJwtSubFromAuthHeader_2 = require('./getJwtSubFromAuthHeader');
Object.defineProperty(exports, 'getJwtSubFromAuthHeader', {
  enumerable: true,
  get: function () {
    return getJwtSubFromAuthHeader_2.default;
  },
});
var isDecimal_2 = require('./isDecimal');
Object.defineProperty(exports, 'isDecimal', {
  enumerable: true,
  get: function () {
    return isDecimal_2.default;
  },
});
var isEmail_2 = require('./isEmail');
Object.defineProperty(exports, 'isEmail', {
  enumerable: true,
  get: function () {
    return isEmail_2.default;
  },
});
var isEmpty_2 = require('./isEmpty');
Object.defineProperty(exports, 'isEmpty', {
  enumerable: true,
  get: function () {
    return isEmpty_2.default;
  },
});
var logger_2 = require('./logger');
Object.defineProperty(exports, 'logger', {
  enumerable: true,
  get: function () {
    return logger_2.default;
  },
});
var validateFields_1 = require('./validateFields');
Object.defineProperty(exports, 'validateFields', {
  enumerable: true,
  get: function () {
    return validateFields_1.default;
  },
});
exports.default = {
  // generateUid,
  getCurrentTimestamp: getCurrentTimestamp_1.default,
  getJwtSubFromAuthHeader: getJwtSubFromAuthHeader_1.default,
  isDecimal: isDecimal_1.default,
  isEmail: isEmail_1.default,
  isEmpty: isEmpty_1.default,
  logger: logger_1.default,
  // validateFields,
};
