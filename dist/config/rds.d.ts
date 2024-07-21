declare const _default: {
    aurora: {
        mysql: {
            region: string;
            databaseName: string | undefined;
            connectionType: string | undefined;
            dataApi: {
                secretArn: string | undefined;
                resourceArn: string | undefined;
                maxAttempts: string | number;
                requestTimeout: string | number;
            };
            proxy: {
                dbCredentialsSecretId: string | undefined;
            };
        };
    };
};
export default _default;
