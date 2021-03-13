export default number => {
  if (typeof number !== 'string' && number.toString().indexOf('.') !== -1) {
    return true;
  }

  return false;
};
