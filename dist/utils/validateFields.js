Object.defineProperty(exports, '__esModule', { value: true });
const LesgoException_1 = require('../exceptions/LesgoException');
const isEmail_1 = require('./isEmail');
const isDecimal_1 = require('./isDecimal');
const FILE = 'lesgo/utils/validateFields';
const isValidJSON = jsonString => {
  if (typeof jsonString !== 'string') {
    return false;
  }
  try {
    JSON.parse(jsonString);
    return true;
  } catch (err) {
    return false;
  }
};
const validateFields = (params, validFields) => {
  const validated = {};
  validFields.forEach(field => {
    const { required, type, key, isCollection, enumValues = [] } = field;
    if (required) {
      if (typeof params[key] === 'object') {
        if (Array.isArray(params[key]) && params[key].length === 0) {
          throw new LesgoException_1.default(
            `Missing required '${key}'`,
            `${FILE}::MISSING_REQUIRED_${key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }
      if (!params[key]) {
        if (typeof params[key] !== 'number') {
          throw new LesgoException_1.default(
            `Missing required '${key}'`,
            `${FILE}::MISSING_REQUIRED_${key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }
    }
    if (isCollection) {
      try {
        validateFields({ [key]: params[key] }, [
          { key, required, type: 'array' },
        ]);
      } catch (_) {
        throw new LesgoException_1.default(
          `Invalid type for '${key}', expecting collection of '${type}'`,
          `${FILE}::INVALID_TYPE_${key.toUpperCase()}`,
          500,
          { field, value: params[key] }
        );
      }
    }
    (isCollection ? params[key] || [] : [params[key]]).forEach(paramsItem => {
      if (
        (type === 'string' &&
          typeof paramsItem !== 'undefined' &&
          typeof paramsItem !== 'string') ||
        (type === 'object' &&
          typeof paramsItem !== 'undefined' &&
          typeof paramsItem !== 'object') ||
        (type === 'number' &&
          typeof paramsItem !== 'undefined' &&
          typeof paramsItem !== 'number') ||
        (type === 'decimal' &&
          typeof paramsItem !== 'undefined' &&
          !(0, isDecimal_1.default)(paramsItem)) ||
        (type === 'email' &&
          typeof paramsItem !== 'undefined' &&
          !(0, isEmail_1.default)(paramsItem)) ||
        (type === 'array' &&
          typeof paramsItem !== 'undefined' &&
          !Array.isArray(paramsItem)) ||
        (type === 'enum' &&
          typeof paramsItem !== 'undefined' &&
          !enumValues.includes(paramsItem)) ||
        (type === 'function' &&
          typeof paramsItem !== 'undefined' &&
          {}.toString.call(paramsItem) !== '[object Function]') ||
        (type === 'json' &&
          typeof paramsItem !== 'undefined' &&
          !isValidJSON(paramsItem))
      ) {
        throw new LesgoException_1.default(
          `Invalid type for '${key}', expecting ${
            isCollection ? 'collection of ' : ''
          }'${type}'`,
          `${FILE}::INVALID_TYPE_${key.toUpperCase()}`,
          500,
          { field, value: paramsItem }
        );
      }
    });
    if (typeof params[key] !== 'undefined') {
      validated[key] = params[key];
    }
  });
  return validated;
};
exports.default = validateFields;
