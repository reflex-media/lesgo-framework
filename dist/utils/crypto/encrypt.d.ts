import { EncryptionAlgorithm } from './validateEncryptionFields';
export interface EncryptOptions {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
    ivLength?: number;
}
declare const encrypt: (text: string, opts?: EncryptOptions) => string;
export default encrypt;
