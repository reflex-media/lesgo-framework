const isDecimal = (number: number | string) =>
  typeof number !== 'string' && number.toString().indexOf('.') !== -1;

export default isDecimal;
