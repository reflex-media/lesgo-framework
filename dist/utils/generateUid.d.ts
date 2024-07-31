export interface GenerateUidParams {
    prefix?: string;
    suffix?: string;
    length?: number;
}
/**
 * Generates a unique identifier with optional prefix, suffix, and length.
 *
 * @param params - The parameters for generating the unique identifier.
 * @returns The generated unique identifier.
 */
declare const generateUid: (params?: GenerateUidParams) => string;
export default generateUid;
