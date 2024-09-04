import isEmpty from './isEmpty';
export const getTokenData = authHeader => {
  try {
    return JSON.parse(
      Buffer.from(authHeader.split('.')[1], 'base64').toString()
    );
  } catch (err) {
    return {};
  }
};
/**
 * Extracts the subject (sub) claim from the JWT token in the provided authorization header.
 *
 * @param authHeader - The authorization header containing the JWT token.
 * @returns The subject (sub) claim from the JWT token, or null if the header is empty or the subject claim is not present.
 */
const getJwtSubFromAuthHeader = authHeader => {
  if (isEmpty(authHeader)) {
    return null;
  }
  const data = getTokenData(authHeader);
  return data.sub || null;
};
export default getJwtSubFromAuthHeader;
