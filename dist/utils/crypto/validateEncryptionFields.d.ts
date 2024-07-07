export declare enum EncryptionAlgorithm {
    AES256 = "aes-256-cbc",
    AES512 = "aes-512-cbc"
}
export declare const validateEncryptionAlgorithm: (algorithm?: EncryptionAlgorithm) => void;
export declare const validateSecretKey: (secretKey?: string, algorithm?: EncryptionAlgorithm) => void;
export declare const validateIvLength: (ivLength?: number, algorithm?: EncryptionAlgorithm) => void;
declare const validateEncryptionFields: (text: string, { algorithm, secretKey, ivLength, }?: {
    algorithm?: EncryptionAlgorithm | undefined;
    secretKey?: string | undefined;
    ivLength?: number | undefined;
}) => {
    validText: string;
    validAlgorithm: EncryptionAlgorithm;
    validSecretKey: string;
    validIvLength: number;
};
export default validateEncryptionFields;
