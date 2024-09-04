import { EncryptionAlgorithm } from './validateEncryptionFields';
export interface DecryptOptions {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
}
/**
 * Decrypts the given encrypted text.
 *
 * @param text - The encrypted text to be decrypted.
 * @param opts - Optional decryption options.
 * @returns The decrypted text.
 *
 * @throws {LesgoException} If there is an error decrypting the text.
 * @throws {LesgoException} If the text is not a string.
 * @throws {LesgoException} If the text is not encrypted.
 * @throws {LesgoException} If the algorithm is not valid.
 * @throws {LesgoException} If the secret key is not valid.
 * @throws {LesgoException} If the secret key is not provided.
 * @throws {LesgoException} If the algorithm is not provided.
 * @throws {LesgoException} If the text is not provided.
 *
 * @example
 * ```typescript
 * import { decrypt } from 'lesgo/utils/crypto';
 *
 * const encryptedText = 'encryptedText';
 *
 * const decryptedText = decrypt(encryptedText);
 * console.log(decryptedText); // Decrypted text
 * ```
 */
declare const decrypt: (text: string, opts?: DecryptOptions) => string;
export default decrypt;
