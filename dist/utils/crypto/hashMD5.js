Object.defineProperty(exports, '__esModule', { value: true });
const crypto_1 = require('crypto');
const LesgoException_1 = require('../../exceptions/LesgoException');
const isEmpty_1 = require('../isEmpty');
const hashMD5 = data => {
  if ((0, isEmpty_1.default)(data)) {
    throw new LesgoException_1.default(
      'Empty parameter supplied on hashMD5',
      'CRYPTO_HASHMD5_EMPTY_PARAMETER'
    );
  }
  const hashedValue = (0, crypto_1.createHash)('md5')
    .update(data)
    .digest('hex');
  return hashedValue;
};
exports.default = hashMD5;
