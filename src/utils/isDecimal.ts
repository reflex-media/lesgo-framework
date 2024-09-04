/**
 * Checks if a given number or string representation of a number is a decimal.
 *
 * @param number - The number or string representation of a number to check.
 * @returns A boolean indicating whether the number is a decimal or not.
 */
const isDecimal = (number: number | string) =>
  typeof number !== 'string' && number.toString().indexOf('.') !== -1;

export default isDecimal;
