export type HashAlgorithm = 'md5' | 'sha256' | 'sha512';
export interface HashOptions {
    algorithm?: HashAlgorithm;
}
declare const hash: (data: string, opts?: HashOptions) => string;
export default hash;
