declare const _default: {
    aurora: {
        mysql: {
            region: string;
            databaseName: string | undefined;
            proxy: {
                dbCredentialsSecretId: string | undefined;
                host: string | undefined;
            };
        };
    };
};
export default _default;
