import prepSQLInsertParams from '../prepSQLInsertParams';

const columns = [
  { key: 'uid', type: 'string', required: true },
  {
    key: 'type',
    type: 'enum',
    enumValues: ['photo', 'video'],
    required: true,
  },
  { key: 'table_name', type: 'string', required: false },
  { key: 'row_id', type: 'number', required: false },
  { key: 'id', type: 'number', required: true },
];

describe('test prepSQLInsertParams util', () => {
  test('should return all the fields if provided', () => {
    const params = {
      uid: 'sample-123123',
      type: 'photo',
      table_name: 'medias',
      row_id: 123,
      id: 123,
    };

    expect(prepSQLInsertParams(params, columns)).toMatchObject({
      insertColumns: 'uid,type,table_name,row_id,id',
      insertValues: ':uid,:type,:table_name,:row_id,:id',
      insertFields: params,
    });
  });

  test('should return only the given fields', () => {
    const params = {
      uid: 'sample-123123',
      type: 'photo',
      id: 123,
    };

    expect(prepSQLInsertParams(params, columns)).toMatchObject({
      insertColumns: 'uid,type,id',
      insertValues: ':uid,:type,:id',
      insertFields: params,
    });
  });
});
