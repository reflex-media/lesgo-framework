declare const getSecretValue: (secretId: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<any>;
export default getSecretValue;
