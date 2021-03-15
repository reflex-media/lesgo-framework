export default (params, columns) => {
  const updateFields = {};
  const updateColumnValues = [];
  let wherePrimaryKey = '';

  columns.forEach(column => {
    const { key } = column;

    if (typeof params[key] !== 'undefined') {
      if (key === 'id') {
        wherePrimaryKey = `${key}=:${key}`;
        updateFields[key] = params[key];
      } else {
        updateColumnValues.push([`${key}=:${key}`]);
        updateFields[key] = params[key];
      }
    }
  });

  return {
    updateColumnValues: updateColumnValues.join(','),
    wherePrimaryKey,
    updateFields,
  };
};
