/**
 * Checks if a value is empty.
 *
 * @param value - The value to check.
 * @returns Returns `true` if the value is empty, otherwise `false`.
 */
const isEmpty = value => {
  if (value === undefined || value === null || value === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  return false;
};
export default isEmpty;
