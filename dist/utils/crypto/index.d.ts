import decrypt from './decrypt';
import encrypt from './encrypt';
import hash from './hash';
export { decrypt, encrypt, hash };
declare const _default: {
    decrypt: (text: string, opts?: import("./decrypt").DecryptOptions | undefined) => string;
    encrypt: (text: string, opts?: import("./encrypt").EncryptOptions | undefined) => string;
    hash: (data: string, opts?: import("./hash").HashOptions | undefined) => string;
};
export default _default;
