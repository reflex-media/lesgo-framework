import LesgoException from '../../exceptions/LesgoException';
import validateFields, { Field } from '../validateFields';

describe('validateFields', () => {
  const validFields = [
    { key: 'name', type: 'string', required: true },
    { key: 'age', type: 'number', required: false },
    { key: 'email', type: 'email', required: true },
    { key: 'hobbies', type: 'array', required: false },
    { key: 'metadata', type: 'json', required: false },
    { key: 'someObject', type: 'object', required: false },
    { key: 'spentAmount', type: 'decimal', required: false },
    {
      key: 'level',
      type: 'enum',
      required: false,
      enumValues: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
    },
    { key: 'someFunction', type: 'function', required: false },
  ] satisfies Field[];

  it('should validate fields and return validated object', () => {
    const params = {
      name: 'John',
      age: 30,
      email: 'john@example.com',
      hobbies: ['reading', 'coding'],
      metadata: JSON.stringify({ someKey: 'someValue' }),
      someObject: { someKey: 'someValue' },
      spentAmount: 99.98,
    };

    const validated = validateFields(params, validFields);

    expect(validated).toEqual(params);
  });

  it('should throw LesgoException for missing required field', () => {
    const params = {
      name: 'John',
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw LesgoException for invalid type', () => {
    const params = {
      name: 'John',
      age: '30',
      email: 'john@example.com',
      hobbies: 'reading',
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw error if invalid JSON', () => {
    const params = {
      name: 'John',
      email: 'john@doe.com',
      metadata: 'invalid-json',
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw error if expected JSON is not a string', () => {
    const params = {
      name: 'John',
      email: 'john@doe.com',
      metadata: 999,
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should return true if valid JSON', () => {
    const params = {
      name: 'John',
      email: 'john@doe.com',
      metadata: JSON.stringify({ someKey: 'someValue' }),
    };

    expect(validateFields(params, validFields)).toBeTruthy();
  });

  it('should throw error if array is required', () => {
    const validFields = [{ key: 'hobbies', type: 'array', required: true }];

    const params = {
      hobbies: [],
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw error if decimal is not decimal', () => {
    const params = {
      name: 'John',
      email: 'john@example.com',
      spentAmount: 199,
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw error if value is not in enum', () => {
    const params = {
      name: 'John',
      email: 'john@example.com',
      level: 'NOOB',
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });

  it('should throw error if function is not a function', () => {
    const params = {
      name: 'John',
      email: 'john@example.com',
      someFunction: 'no-function',
    };

    expect(() => {
      validateFields(params, validFields);
    }).toThrow(LesgoException);
  });
});
