export default class LesgoException extends Error {
    statusCode: number;
    code: string;
    extra: any;
    constructor(message: string, errorCode?: string, httpStatusCode?: number, extra?: any);
}
