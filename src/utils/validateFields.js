import LesgoException from '../exceptions/LesgoException';
import isEmail from './isEmail';
import isDecimal from './isDecimal';

const FILE = 'Utils/validateFields';

const isValidJSON = json => {
  if (typeof json !== 'string') {
    return false;
  }

  // Cannot find a regex solution to this
  try {
    JSON.parse(json);

    return true;
  } catch (_) {
    return false;
  }
};

const isValidBoolean = input => {
  if (typeof input === 'string') {
    return input === 'true' || input === 'false';
  }
  if (typeof input === 'number') {
    return input === 1 || input === 0;
  }
  return typeof input === 'boolean';
};

const validateFields = (params, validFields) => {
  const validated = {};

  validFields.forEach(field => {
    const { required, type, key, isCollection, enumValues = [] } = field;

    if (required) {
      if (typeof params[key] === 'object') {
        if (Array.isArray(params[key]) && params[key].length === 0) {
          throw new LesgoException(
            `Missing required '${key}'`,
            `${FILE}::MISSING_REQUIRED_${key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }

      if (type !== 'boolean' && !params[key]) {
        if (typeof params[key] !== 'number') {
          throw new LesgoException(
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
        throw new LesgoException(
          `Invalid type for '${key}', expecting collection of '${type}'`,
          `${FILE}::INVALID_TYPE_${key.toUpperCase()}`,
          500,
          { field, value: params[key] }
        );
      }
    }

    (isCollection ? params[key] || [] : [params[key]]).forEach(paramsItem => {
      if (
        (type === 'boolean' && !isValidBoolean(paramsItem)) ||
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
          !isDecimal(paramsItem)) ||
        (type === 'email' &&
          typeof paramsItem !== 'undefined' &&
          !isEmail(paramsItem)) ||
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
        throw new LesgoException(
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

export default validateFields;
