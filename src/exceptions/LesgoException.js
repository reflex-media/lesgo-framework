import isEmpty from '../utils/isEmpty';

export default class LesgoException extends Error {
  constructor(
    message,
    errorCode = 'LESGO_EXCEPTION',
    httpStatusCode = 500,
    extra = {}
  ) {
    super();
    this.name = 'LesgoException';
    this.message = message;
    this.statusCode = httpStatusCode;
    this.code = errorCode;

    Error.captureStackTrace(this, this.constructor);

    if (!isEmpty(extra)) this.extra = extra;
  }
}
