/**
 * Checks if a given string is a valid email address.
 *
 * @param email - The email address to validate.
 * @returns `true` if the email is valid, `false` otherwise.
 * @throws {LesgoException} If the `email` parameter is empty.
 */
declare const isEmail: (email: string) => boolean;
export default isEmail;
