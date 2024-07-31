import formatUnixTimestamp from './formatUnixTimestamp';
import generateUid from './generateUid';
import getCurrentTimestamp from './getCurrentTimestamp';
import isDecimal from './isDecimal';
import isEmail from './isEmail';
import isEmpty from './isEmpty';
import logger from './logger';
import validateFields from './validateFields';
export { formatUnixTimestamp, generateUid, getCurrentTimestamp, isDecimal, isEmail, isEmpty, logger, validateFields, };
declare const _default: {
    formatUnixTimestamp: (timestamp: number) => string;
    generateUid: (params?: import("./generateUid").GenerateUidParams) => string;
    getCurrentTimestamp: () => number;
    isDecimal: (number: string | number) => boolean;
    isEmail: (email: string) => boolean;
    isEmpty: (value: any) => boolean;
    logger: import("../services").LoggerService;
    validateFields: (params: import("./validateFields").Params, validFields: import("./validateFields").Field[]) => {
        [key: string]: any;
    };
};
export default _default;
