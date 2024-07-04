import encrypt from './encrypt';
import decrypt from './decrypt';
import hash from './hash';
import hashMD5 from './hashMD5';
export { encrypt, decrypt, hash, hashMD5 };
declare const _default: {
    encrypt: (text: string) => string;
    decrypt: (text: string) => string;
    hash: (data: string) => string;
    hashMD5: (data: string) => string;
};
export default _default;
