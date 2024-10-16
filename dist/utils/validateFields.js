import LesgoException from '../exceptions/LesgoException';
import isEmail from './isEmail';
import isDecimal from './isDecimal';
const FILE = 'lesgo.utils.validateFields';
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
/**
 * Validates the fields of an object based on the provided validation rules.
 *
 * @param params - The object containing the fields to be validated.
 * @param validFields - An array of field validation rules.
 * @returns An object containing the validated fields.
 * @throws {LesgoException} If a required field is missing or if a field has an invalid type.
 */
const validateFields = (params, validFields) => {
  const validated = {};
  validFields.forEach(field => {
    const { required, type, key, isCollection, enumValues = [] } = field;
    const value = params[key];
    if (required) {
      if (typeof value === 'object') {
        if (Array.isArray(value) && value.length === 0) {
          throw new LesgoException(
            `Missing required '${key}'`,
            `${FILE}::MISSING_REQUIRED_${key.toUpperCase()}`,
            500,
            { field }
          );
        }
      }
      if (!value) {
        if (typeof value !== 'number') {
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
        validateFields({ [key]: value }, [{ key, required, type: 'array' }]);
      } catch (_) {
        throw new LesgoException(
          `Invalid type for '${key}', expecting collection of '${type}'`,
          `${FILE}::INVALID_TYPE_${key.toUpperCase()}`,
          500,
          { field, value }
        );
      }
    }
    const paramsItems = isCollection ? value || [] : [value];
    paramsItems.forEach(paramsItem => {
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
    if (typeof value !== 'undefined') {
      validated[key] = value;
    }
  });
  return validated;
};
export default validateFields;
