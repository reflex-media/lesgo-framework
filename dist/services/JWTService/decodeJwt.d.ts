import { JwtHeader, JwtPayload } from 'jsonwebtoken';
declare const decodeJwt: (token: string) => {
    header: JwtHeader;
    payload: JwtPayload;
    signature: string;
};
export default decodeJwt;
