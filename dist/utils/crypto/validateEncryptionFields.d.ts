export declare enum EncryptionAlgorithm {
    AES128 = "aes-128-cbc",
    AES192 = "aes-192-cbc",
    AES256 = "aes-256-cbc",
    AES512 = "aes-512-cbc"
}
interface ValidateEncryptionFieldsOptions {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
}
export declare const validateEncryptionAlgorithm: (algorithm: EncryptionAlgorithm) => void;
export declare const validateSecretKey: (secretKey?: string, algorithm?: EncryptionAlgorithm) => void;
declare const validateEncryptionFields: (text: string, opts?: ValidateEncryptionFieldsOptions) => {
    validText: string;
    validAlgorithm: EncryptionAlgorithm;
    validSecretKey: string;
    validIvLength: number;
};
export default validateEncryptionFields;
