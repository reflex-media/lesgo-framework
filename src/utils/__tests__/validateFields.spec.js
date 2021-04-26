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
  { key: 'decimalCheck', type: 'decimal', required: true },
  { key: 'totalRecord', type: 'number', required: true },
];

describe('test Utils/validateFields', () => {
  it('should return validated fields', () => {
    expect(validateFields(params, validFields)).toMatchObject(params);
  });

  it('should throw missing required field when not present', () => {
    const newParams = { ...params };
    delete newParams.email;

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        "Missing required 'email'",
        `${FILE}::MISSING_REQUIRED_EMAIL}`
      )
    );
  });

  it('should throw invalid type when non-string value check', () => {
    const newParams = { ...params, name: 123 };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'name', expecting 'string'`,
        `${FILE}::INVALID_TYPE_NAME`
      )
    );
  });

  it('should throw invalid type when non-object value check', () => {
    const newParams = { ...params, roles: 1597929335 };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'roles', expecting 'object'`,
        `${FILE}::INVALID_TYPE_ROLES`
      )
    );
  });

  it('should throw invalid type when non-number value check', () => {
    const newParams = { ...params, Id: '123' };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'Id', expecting 'number'`,
        `${FILE}::INVALID_TYPE_ID`
      )
    );
  });

  it('should throw invalid type when non-array value check', () => {
    const newParams = { ...params, listItem: { created_at: 1597929335 } };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'listItem', expecting 'array'`,
        `${FILE}::INVALID_TYPE_LISTITEM`
      )
    );
  });

  it('should throw invalid type when non-enum value check', async () => {
    const newParams = { ...params, status: 'private' };

    expect(() => validateFields(newParams, validFields)).toThrow(
      new LesgoException(
        `Invalid type for 'status', expecting 'enum'`,
        `${FILE}::INVALID_TYPE_STATUS`
      )
    );
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
