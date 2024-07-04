Object.defineProperty(exports, '__esModule', { value: true });
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};
exports.default = getCurrentTimestamp;
