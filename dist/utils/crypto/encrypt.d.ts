import { EncryptionAlgorithm } from './validateEncryptionFields';
declare const encrypt: (text: string, { algorithm, secretKey, ivLength, }?: {
    algorithm?: EncryptionAlgorithm | undefined;
    secretKey?: string | undefined;
    ivLength?: number | undefined;
}) => string;
export default encrypt;
