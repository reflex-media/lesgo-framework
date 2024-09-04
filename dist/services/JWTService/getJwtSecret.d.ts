export interface GetJwtSecretInput {
    secret?: string;
    keyid?: string;
}
export interface JwtSecret {
    keyid: string;
    secret: string;
}
declare const getJwtSecret: (input: GetJwtSecretInput) => {
    keyid: string;
    secret: string;
};
export default getJwtSecret;
