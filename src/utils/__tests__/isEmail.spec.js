import isEmail from '../isEmail';
import LesgoException from '../../exceptions/LesgoException';

describe('test isEmail util', () => {
  test('isEmail should throws an Error when empty sting parameters were passed', () => {
    expect(() => {
      isEmail('');
    }).toThrow(
      new LesgoException('Empty parameter supplied', 'IS_EMAIL_EMPTY_PARAMETER')
    );
  });

  test('isEmail should throws an Error when null parameters were passed', () => {
    expect(() => {
      isEmail(null);
    }).toThrow(
      new LesgoException('Empty parameter supplied', 'IS_EMAIL_EMPTY_PARAMETER')
    );
  });

  it('isEmail should return false for invalid email', () => {
    return expect(isEmail('test@g')).toBeFalsy();
  });

  it('isEmail should return true for valid email', () => {
    return expect(isEmail('test@gmail.com')).toBeTruthy();
  });
});
