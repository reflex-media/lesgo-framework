"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty_1 = require("../utils/isEmpty");
class LesgoException extends Error {
    constructor(message, errorCode = 'LESGO_EXCEPTION', httpStatusCode = 500, extra = {}) {
        super();
        this.name = 'LesgoException';
        this.message = message;
        this.statusCode = httpStatusCode;
        this.code = errorCode;
        Error.captureStackTrace(this, this.constructor);
        if (!(0, isEmpty_1.default)(extra)) {
            this.extra = extra;
        }
    }
}
exports.default = LesgoException;
