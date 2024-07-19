export interface GetSecretValueOptions {
    region: string;
    singletonConn: string;
}
declare const getSecretValue: (secretId: string, { region, singletonConn }: GetSecretValueOptions) => Promise<any>;
export default getSecretValue;
