import { SignOptions } from 'jsonwebtoken';
declare const sign: (payload: any, secret: string, opts?: SignOptions) => string;
export default sign;
