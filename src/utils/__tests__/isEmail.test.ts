import isEmail from '../isEmail';
import LesgoException from '../../exceptions/LesgoException';

describe('isEmail', () => {
  it('should return true for a valid email', () => {
    const validEmail = 'test@example.com';
    const result = isEmail(validEmail);
    expect(result).toBe(true);
  });

  it('should return false for an invalid email', () => {
    const invalidEmail = 'invalid-email';
    const result = isEmail(invalidEmail);
    expect(result).toBe(false);
  });

  it('should throw an exception for an empty parameter', () => {
    const emptyEmail = '';
    expect(() => {
      isEmail(emptyEmail);
    }).toThrow(LesgoException);
  });
});
