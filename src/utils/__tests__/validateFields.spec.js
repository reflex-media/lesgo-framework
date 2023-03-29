import LesgoException from '../../exceptions/LesgoException';
import validateFields from '../validateFields';

const FILE = 'Utils/validateFields';

const params = {
  Id: 99,
  name: 'name',
  email: 'email@mail.com',
  roles: { admin: 'admin' },
  listItem: ['apple', 'banana'],
  status: 'active',
  decimalCheck: 1.99,
  totalRecord: 99,
  functionCheck: () => {},
  jsonCheck: JSON.stringify({
    test: 'json value',
    testArray: ['withvalues', 'here'],
    testNum: 1,
  }),
  statusCollection: ['active', 'inactive', 'active'],
};

const validFields = [
  { key: 'Id', type: 'number', required: true },
  { key: 'name', type: 'string', required: true },
  { key: 'email', type: 'email', required: true },
  { key: 'roles', type: 'object', required: true },
  { key: 'listItem', type: 'array', required: true },
  {
    key: 'status',
    type: 'enum',
    enumValues: ['active', 'inactive'],
    required: true,
  },
  {
    key: 'decimalCheck',
    type: 'decimal',
    required: true,
  },
  { key: 'totalRecord', type: 'number', required: true },
  {
    key: 'functionCheck',
    type: 'function',
    required: true,
  },
  {
    key: 'jsonCheck',
    type: 'json',
    required: true,
  },
  {
    key: 'statusCollection',
    type: 'enum',
    enumValues: ['active', 'inactive'],
    required: true,
    isCollection: true,
  },
];

describe('test Utils/validateFields', () => {
  it('should return validated fields', () => {
    expect(validateFields(params, validFields)).toMatchObject(params);
  });

  it('should throw missing required field when not present', () => {
    const newParams = { ...params };
    delete newParams.email;

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual("Missing required 'email'");
      expect(e.code).toEqual(`${FILE}::MISSING_REQUIRED_EMAIL`);
      expect(e.extra).toStrictEqual({
        field: validFields[2],
      });
    }
  });

  it('should throw invalid type when non-string value check', () => {
    const newParams = { ...params, name: 123 };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(`Invalid type for 'name', expecting 'string'`);
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_NAME`);
      expect(e.extra).toStrictEqual({
        field: validFields[1],
        value: 123,
      });
    }
  });

  it('should throw invalid type when non-object value check', () => {
    const newParams = { ...params, roles: 1597929335 };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(`Invalid type for 'roles', expecting 'object'`);
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_ROLES`);
      expect(e.extra).toStrictEqual({
        field: validFields[3],
        value: 1597929335,
      });
    }
  });

  it('should throw invalid type when non-number value check', () => {
    const newParams = { ...params, Id: '123' };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(`Invalid type for 'Id', expecting 'number'`);
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_ID`);
      expect(e.extra).toStrictEqual({
        field: validFields[0],
        value: '123',
      });
    }
  });

  it('should throw invalid type when non-array value check', () => {
    const newParams = { ...params, listItem: { created_at: 1597929335 } };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(
        `Invalid type for 'listItem', expecting 'array'`
      );
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_LISTITEM`);
      expect(e.extra).toStrictEqual({
        field: validFields[4],
        value: { created_at: 1597929335 },
      });
    }
  });

  it('should throw required when array value is empty but required', () => {
    const newParams = { ...params, listItem: [] };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Missing required 'listItem'`,
        `${FILE}::MISSING_REQUIRED_LISTITEM`
      )
    );
  });

  it('should not throw invalid type when array value is empty and not required', () => {
    const newParams = { ...params, listItem: [] };
    const newValidFields = [
      { key: 'listItem', type: 'array', required: false },
    ];

    expect(validateFields(newParams, newValidFields)).toMatchObject({
      listItem: [],
    });
  });

  it('should throw invalid type when non-enum value check', async () => {
    const newParams = { ...params, status: 'private' };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'status', expecting 'enum'`,
        `Invalid type for 'status', expecting 'enum'`
      )
    );

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(`Invalid type for 'status', expecting 'enum'`);
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_STATUS`);
      expect(e.extra).toStrictEqual({
        field: validFields[5],
        value: 'private',
      });
    }
  });

  it('should throw invalid type when non-function value check', async () => {
    const newParams = {
      ...params,
      functionCheck: { not: 'function' },
    };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(
        `Invalid type for 'functionCheck', expecting 'function'`
      );
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_FUNCTIONCHECK`);
      expect(e.extra).toStrictEqual({
        field: validFields[8],
        value: { not: 'function' },
      });
    }
  });

  it.each`
    value
    ${'not a json'}
    ${3}
    ${'"invalid'}
    ${{ not: 'json' }}
    ${'{"missing":"bracket"}}'}
  `(
    'should throw invalid type when non-json $value check',
    async ({ value }) => {
      const newParams = {
        ...params,
        jsonCheck: value,
      };

      let e = {};
      try {
        const validated = validateFields(newParams, validFields);

        expect(validated).toThrow();
      } catch (err) {
        e = { ...err };
      } finally {
        expect(e.name).toEqual('LesgoException');
        expect(e.message).toEqual(
          `Invalid type for 'jsonCheck', expecting 'json'`
        );
        expect(e.code).toEqual(`${FILE}::INVALID_TYPE_JSONCHECK`);
        expect(e.extra).toStrictEqual({
          field: validFields[9],
          value,
        });
      }
    }
  );

  it('should throw invalid type when non-collection value check', async () => {
    const newParams = {
      ...params,
      statusCollection: 'active',
    };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(
        `Invalid type for 'statusCollection', expecting collection of 'enum'`
      );
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_STATUSCOLLECTION`);
      expect(e.extra).toStrictEqual({
        field: validFields[10],
        value: 'active',
      });
    }
  });

  it('should ignore type when collection value check is non-required', async () => {
    const newParams = { ...params };
    const newValidFields = [...validFields];
    delete newParams.statusCollection;
    newValidFields[10].required = false;

    const validated = validateFields(newParams, newValidFields);

    expect(validated).toStrictEqual(newParams);
  });

  it('should throw invalid type when non-enum collection value check', async () => {
    const newParams = {
      ...params,
      statusCollection: ['archive'],
    };

    let e = {};
    try {
      const validated = validateFields(newParams, validFields);

      expect(validated).toThrow();
    } catch (err) {
      e = { ...err };
    } finally {
      expect(e.name).toEqual('LesgoException');
      expect(e.message).toEqual(
        `Invalid type for 'statusCollection', expecting collection of 'enum'`
      );
      expect(e.code).toEqual(`${FILE}::INVALID_TYPE_STATUSCOLLECTION`);
      expect(e.extra).toStrictEqual({
        field: validFields[10],
        value: 'archive',
      });
    }
  });

  it('should return only valid and allowed fields when other fields are received', () => {
    const newParams = { ...params, someOtherKey: 'someOtherValue' };
    const validated = validateFields(newParams, validFields);

    expect(validated).toMatchObject(params);
    expect(validated.Id).toBeDefined();
    expect(validated.someOtherKey).toBeUndefined();
  });

  it('should return success with validated data for non-required fields', () => {
    const newParams = { ...params };
    delete newParams.listItem;

    validFields[4].required = false;
    const validated = validateFields(newParams, validFields);

    expect(validated).toMatchObject(newParams);
    expect(validated.Id).toBeDefined();
    expect(validated.listItem).toBeUndefined();

    validFields[4].required = true;
  });

  it('should return success with validated data for 0 number', () => {
    const newParams = { ...params, totalRecord: 0 };
    const validated = validateFields(newParams, validFields);

    expect(validated).toMatchObject(newParams);
    expect(validated.totalRecord).toBeDefined();
    expect(validated.totalRecord).toEqual(0);
  });

  it('should return success with validated data for number without required', () => {
    const newParams = { ...params };
    validFields[7].required = false;

    const validated = validateFields(newParams, validFields);

    expect(validated).toMatchObject(newParams);
    expect(validated.totalRecord).toBeDefined();
    expect(validated.totalRecord).toEqual(99);

    validFields[7].required = true;
  });

  it('should return error with missing required number', () => {
    const newParams = { ...params };
    delete newParams.totalRecord;

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Missing required 'totalRecord'`,
        `${FILE}::MISSING_REQUIRED_TOTALRECORD`
      )
    );
  });
});
