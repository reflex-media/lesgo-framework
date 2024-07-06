import decrypt from './decrypt';
import encrypt from './encrypt';
import hash from './hash';
import hashMD5 from './hashMD5';
export { decrypt, encrypt, hash, hashMD5 };
declare const _default: {
    decrypt: (text: string) => string;
    encrypt: (text: string) => string;
    hash: (data: string) => string;
    hashMD5: (data: string) => string;
};
export default _default;
