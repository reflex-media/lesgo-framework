export default number =>
  typeof number !== 'string' && number.toString().indexOf('.') !== -1;
