import prepSQLUpdateParams from '../prepSQLUpdateParams';

const columns = [
  { key: 'id', type: 'number', required: true },
  { key: 'table_name', type: 'string', required: false },
  { key: 'row_id', type: 'number', required: false },
];

describe('test prepSQLUpdateParams util', () => {
  test('should return all the fields if provided', () => {
    const params = {
      id: 123,
      table_name: 'users',
      row_id: 123,
    };

    expect(prepSQLUpdateParams(params, columns)).toMatchObject({
      updateColumnValues: 'table_name=:table_name,row_id=:row_id',
      wherePrimaryKey: 'id=:id',
      updateFields: params,
    });
  });

  test('should return only the provided fields', () => {
    const params = {
      id: 123,
      row_id: 124,
    };

    expect(prepSQLUpdateParams(params, columns)).toMatchObject({
      updateColumnValues: 'row_id=:row_id',
      wherePrimaryKey: 'id=:id',
      updateFields: params,
    });
  });
});
