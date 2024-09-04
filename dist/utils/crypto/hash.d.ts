export type HashAlgorithm = 'md5' | 'sha256' | 'sha512';
export interface HashOptions {
    algorithm?: HashAlgorithm;
}
/**
 * Calculates the hash value of the given data using the specified algorithm.
 *
 * @param data - The data to be hashed.
 * @param opts - Optional configuration for the hash algorithm.
 * @returns The hashed value as a string.
 *
 * @throws {LesgoException} if an invalid hash algorithm is supplied.
 * @throws {LesgoException} if the data is not a string.
 * @throws {LesgoException} if the data is not provided.
 * @throws {LesgoException} if the algorithm is not provided.
 * @throws {LesgoException} if the algorithm is not valid.
 * @throws {LesgoException} if the algorithm is not a string.
 * @throws {LesgoException} if the algorithm is not a valid hash algorithm.
 *
 * @example
 * ```typescript
 * import { hash } from 'lesgo/utils/crypto';
 *
 * const data = 'myData';
 *
 * const hashedValue = hash(data);
 * console.log(hashedValue); // Hashed value
 * ```
 */
declare const hash: (data: string, opts?: HashOptions) => string;
export default hash;
