export default class ValidationErrorException extends Error {
  constructor(
    message,
    errorCode = 'VALIDATION_ERROR',
    httpStatusCode = 400,
    extra
  ) {
    super();
    this.name = 'ValidationError';
    this.message = message;
    this.statusCode = httpStatusCode;
    this.code = errorCode;

    Error.captureStackTrace(this, this.constructor);

    if (extra) this.extra = extra;
  }
}
