Object.defineProperty(exports, '__esModule', { value: true });
const isEmpty_1 = require('./isEmpty');
const LesgoException_1 = require('../exceptions/LesgoException');
const isEmail = email => {
  const pattern = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/; // eslint-disable-line no-useless-escape
  if ((0, isEmpty_1.default)(email)) {
    throw new LesgoException_1.default(
      'Empty parameter supplied',
      'IS_EMAIL_EMPTY_PARAMETER'
    );
  }
  return pattern.test(email);
};
exports.default = isEmail;
