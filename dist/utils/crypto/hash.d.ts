export declare enum HashAlgorithm {
    MD5 = "md5",
    SHA256 = "sha256",
    SHA512 = "sha512"
}
declare const hash: (data: string, { algorithm }?: {
    algorithm?: HashAlgorithm | undefined;
}) => string;
export default hash;
