import isEmpty from './isEmpty';
import LesgoException from '../exceptions/LesgoException';

export default email => {
  const pattern = /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,5}$/; // eslint-disable-line no-useless-escape

  if (isEmpty(email)) {
    throw new LesgoException(
      'Empty parameter supplied',
      'IS_EMAIL_EMPTY_PARAMETER'
    );
  }

  return pattern.test(email);
};
