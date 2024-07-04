Object.defineProperty(exports, '__esModule', { value: true });
const nanoid_1 = require('nanoid');
const generateUid = (params = {}) => {
  const { prefix, suffix, length } = params;
  const nanoid = (0, nanoid_1.customAlphabet)(
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    !length ? 21 : length
  );
  const uid = nanoid();
  return `${!prefix ? '' : `${prefix}-`}${uid}${!suffix ? '' : `-${suffix}`}`;
};
exports.default = generateUid;
