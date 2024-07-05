Object.defineProperty(exports, '__esModule', { value: true });
const crypto_1 = require('crypto');
// @ts-ignore
const crypto_2 = require('config/crypto');
const LesgoException_1 = require('../../exceptions/LesgoException');
const isEmpty_1 = require('../isEmpty');
const { algorithm, secretKey } = crypto_2.default;
const decrypt = text => {
  if ((0, isEmpty_1.default)(text)) {
    throw new LesgoException_1.default(
      'Empty parameter supplied on decryp',
      'CRYPTO_DECRYPT_EMPTY_PARAMETER'
    );
  }
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift() || '', 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = (0, crypto_1.createDecipheriv)(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
exports.default = decrypt;
