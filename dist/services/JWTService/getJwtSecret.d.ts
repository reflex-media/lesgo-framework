export interface GetJwtSecretInput {
    secret?: string;
    keyid?: string;
}
declare const getJwtSecret: (input: GetJwtSecretInput) => string;
export default getJwtSecret;
