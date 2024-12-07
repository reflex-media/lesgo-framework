declare const _default: {
    aurora: {
        mysql: {
            region: string;
            databaseName: string | undefined;
            proxy: {
                dbCredentialsSecretId: string | undefined;
                host: string | undefined;
                port: string | undefined;
                connectionLimit: number;
                waitForConnections: boolean;
                queueLimit: number;
            };
        };
    };
};
export default _default;
