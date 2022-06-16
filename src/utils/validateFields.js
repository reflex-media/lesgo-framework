import LesgoException from '../exceptions/LesgoException';
import isEmail from './isEmail';
import isDecimal from './isDecimal';

const FILE = 'Utils/validateFields';

export default (params, validFields) => {
  const validated = {};

  validFields.forEach(field => {
    if (field.required) {
      if (typeof params[field.key] === 'object') {
        if (
          Array.isArray(params[field.key]) &&
          params[field.key].length === 0
        ) {
          throw new LesgoException(
            `Missing required '${field.key}'`,
            `${FILE}::MISSING_REQUIRED_${field.key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }

      if (!params[field.key]) {
        if (typeof params[field.key] !== 'number') {
          throw new LesgoException(
            `Missing required '${field.key}'`,
            `${FILE}::MISSING_REQUIRED_${field.key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }
    }

    if (
      (field.type === 'string' &&
        typeof params[field.key] !== 'undefined' &&
        typeof params[field.key] !== 'string') ||
      (field.type === 'object' &&
        typeof params[field.key] !== 'undefined' &&
        typeof params[field.key] !== 'object') ||
      (field.type === 'number' &&
        typeof params[field.key] !== 'undefined' &&
        typeof params[field.key] !== 'number') ||
      (field.type === 'decimal' &&
        typeof params[field.key] !== 'undefined' &&
        !isDecimal(params[field.key])) ||
      (field.type === 'email' &&
        typeof params[field.key] !== 'undefined' &&
        !isEmail(params[field.key])) ||
      (field.type === 'array' &&
        typeof params[field.key] !== 'undefined' &&
        !Array.isArray(params[field.key])) ||
      (field.type === 'enum' &&
        typeof params[field.key] !== 'undefined' &&
        !field.enumValues.includes(params[field.key]))
    ) {
      throw new LesgoException(
        `Invalid type for '${field.key}', expecting '${field.type}'`,
        `${FILE}::INVALID_TYPE_${field.key.toUpperCase()}`,
        500,
        { field, value: params[field.key] }
      );
    }

    if (typeof params[field.key] !== 'undefined') {
      validated[field.key] = params[field.key];
    }
  });

  return validated;
};
