export { default as getCurrentTimestamp } from './getCurrentTimestamp';
export { default as getJwtSubFromAuthHeader } from './getJwtSubFromAuthHeader';
export { default as isDecimal } from './isDecimal';
export { default as isEmail } from './isEmail';
export { default as isEmpty } from './isEmpty';
export { default as logger } from './logger';
export { default as validateFields } from './validateFields';
declare const _default: {
    getCurrentTimestamp: () => number;
    getJwtSubFromAuthHeader: (authHeader: string) => any;
    isDecimal: (number: number | string) => boolean;
    isEmail: (email: string) => boolean;
    isEmpty: (value: any) => boolean;
    logger: import("..").LoggerService;
};
export default _default;
