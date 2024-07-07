import { EncryptionAlgorithm } from './validateEncryptionFields';
declare const decrypt: (text: string, { algorithm, secretKey, }?: {
    algorithm?: EncryptionAlgorithm | undefined;
    secretKey?: string | undefined;
}) => string;
export default decrypt;
