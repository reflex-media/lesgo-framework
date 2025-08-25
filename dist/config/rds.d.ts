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
                usePool: boolean;
            };
        };
    };
};
export default _default;
