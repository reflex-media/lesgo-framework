import { EncryptionAlgorithm } from './validateEncryptionFields';
export interface DecryptOptions {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
}
declare const decrypt: (text: string, opts?: DecryptOptions) => string;
export default decrypt;
