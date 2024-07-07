import decrypt from './decrypt';
import encrypt from './encrypt';
import hash from './hash';
export { decrypt, encrypt, hash };
declare const _default: {
    decrypt: (text: string, { algorithm, secretKey, }?: {
        algorithm?: import("./validateEncryptionFields").EncryptionAlgorithm | undefined;
        secretKey?: string | undefined;
    }) => string;
    encrypt: (text: string, { algorithm, secretKey, ivLength, }?: {
        algorithm?: import("./validateEncryptionFields").EncryptionAlgorithm | undefined;
        secretKey?: string | undefined;
        ivLength?: number | undefined;
    }) => string;
    hash: (data: string, { algorithm }?: {
        algorithm?: import("./hash").HashAlgorithm | undefined;
    }) => string;
};
export default _default;
