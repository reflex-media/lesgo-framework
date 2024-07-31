import isEmpty from './isEmpty';
import LesgoException from '../exceptions/LesgoException';

/**
 * Checks if a given string is a valid email address.
 *
 * @param email - The email address to validate.
 * @returns `true` if the email is valid, `false` otherwise.
 * @throws {LesgoException} If the `email` parameter is empty.
 */
const isEmail = (email: string) => {
  const pattern = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/; // eslint-disable-line no-useless-escape
  if (isEmpty(email)) {
    throw new LesgoException(
      'Empty parameter supplied',
      'IS_EMAIL_EMPTY_PARAMETER'
    );
  }
  return pattern.test(email);
};

export default isEmail;
