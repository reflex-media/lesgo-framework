import isEmpty from '../utils/isEmpty';

export default class LesgoException extends Error {
  public statusCode: number;
  public code: string;
  public extra: any;

  constructor(
    message: string,
    errorCode: string = 'LESGO_EXCEPTION',
    httpStatusCode: number = 500,
    extra: any = {}
  ) {
    super();
    this.name = 'LesgoException';
    this.message = message;
    this.statusCode = httpStatusCode;
    this.code = errorCode;

    Error.captureStackTrace(this, this.constructor);

    if (!isEmpty(extra)) {
      this.extra = extra;
    }
  }
}
