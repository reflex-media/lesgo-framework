export default (params, columns) => {
  const insertFields = {};
  const insertColumns = [];
  const insertValues = [];

  columns.forEach(column => {
    const { key } = column;

    if (typeof params[key] !== 'undefined') {
      insertColumns.push(key);
      insertValues.push([`:${key}`]);
      insertFields[key] = params[key];
    }
  });

  return {
    insertColumns: insertColumns.join(','),
    insertValues: insertValues.join(','),
    insertFields,
  };
};
