import generateUid from './generateUid';
import getCurrentTimestamp from './getCurrentTimestamp';
import getJwtSubFromAuthHeader from './getJwtSubFromAuthHeader';
import isDecimal from './isDecimal';
import isEmail from './isEmail';
import isEmpty from './isEmpty';
import logger from './logger';
import validateFields from './validateFields';

export { default as getCurrentTimestamp } from './getCurrentTimestamp';
export { default as getJwtSubFromAuthHeader } from './getJwtSubFromAuthHeader';
export { default as isDecimal } from './isDecimal';
export { default as isEmail } from './isEmail';
export { default as isEmpty } from './isEmpty';
export { default as logger } from './logger';
export { default as validateFields } from './validateFields';

export default {
  // generateUid,
  getCurrentTimestamp,
  getJwtSubFromAuthHeader,
  isDecimal,
  isEmail,
  isEmpty,
  logger,
  // validateFields,
};
