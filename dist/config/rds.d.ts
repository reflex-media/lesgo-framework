declare const _default: {
    aurora: {
        mysql: {
            region: string;
            databaseName: string | undefined;
            user: string | undefined;
            password: string | undefined;
            maxPoolCreationRetries: number;
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
