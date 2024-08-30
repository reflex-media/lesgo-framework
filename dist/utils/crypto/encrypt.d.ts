import { EncryptionAlgorithm } from './validateEncryptionFields';
export interface EncryptOptions {
    algorithm?: EncryptionAlgorithm;
    secretKey?: string;
}
/**
 * Encrypts the given text using the specified options.
 *
 * @param text - The text to be encrypted.
 * @param opts - Optional encryption options.
 * @returns The encrypted text.
 *
 * @throws {LesgoException} If there is an error encrypting the text.
 * @throws {LesgoException} If the text is not a string.
 * @throws {LesgoException} If the algorithm is not valid.
 * @throws {LesgoException} If the secret key is not valid.
 * @throws {LesgoException} If the secret key is not provided.
 * @throws {LesgoException} If the algorithm is not provided.
 *
 * @example
 * ```typescript
 * import { encrypt } from 'lesgo/utils/crypto';
 *
 * const text = 'myText';
 *
 * const encryptedText = encrypt(text);
 * console.log(encryptedText); // Encrypted text
 * ```
 */
declare const encrypt: (text: string, opts?: EncryptOptions) => string;
export default encrypt;
