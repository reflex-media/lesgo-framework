Object.defineProperty(exports, '__esModule', { value: true });
const crypto_1 = require('crypto');
// @ts-ignore
const crypto_2 = require('config/crypto');
const LesgoException_1 = require('../../exceptions/LesgoException');
const isEmpty_1 = require('../isEmpty');
const { algorithm, secretKey, ivLength } = crypto_2.default;
exports.default = text => {
  if ((0, isEmpty_1.default)(text)) {
    throw new LesgoException_1.default(
      'Empty parameter supplied on encrypt',
      'CRYPTO_ENCRYPT_EMPTY_PARAMETER'
    );
  }
  const iv = (0, crypto_1.randomBytes)(ivLength);
  const cipher = (0, crypto_1.createCipheriv)(algorithm, secretKey, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};
