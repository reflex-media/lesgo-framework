export declare const getTokenData: (authHeader: string) => any;
/**
 * Extracts the subject (sub) claim from the JWT token in the provided authorization header.
 *
 * @param authHeader - The authorization header containing the JWT token.
 * @returns The subject (sub) claim from the JWT token, or null if the header is empty or the subject claim is not present.
 */
declare const getJwtSubFromAuthHeader: (authHeader: string) => any;
export default getJwtSubFromAuthHeader;
