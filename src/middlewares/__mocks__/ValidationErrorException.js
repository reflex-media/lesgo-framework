import isEmpty from '../utils/isEmpty';

export default class ValidationErrorException extends Error {
  constructor(
    message,
    errorCode = 'VALIDATION_ERROR',
    httpStatusCode = 400,
    extra = {}
  ) {
    super();
    this.name = 'ValidationError';
    this.message = message;
    this.statusCode = httpStatusCode;
    this.code = errorCode;

    Error.captureStackTrace(this, this.constructor);

    if (!isEmpty(extra)) this.extra = extra;
  }
}
