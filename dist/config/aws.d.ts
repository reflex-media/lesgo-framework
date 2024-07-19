declare const _default: {
    region: string;
    s3: {
        bucket: string;
        region: string;
    };
    sqs: {
        region: string;
        queues: {
            alias: string;
            name: string;
            url: string;
        }[];
    };
    dynamodb: {
        region: string;
        tables: {
            alias: string;
            name: string;
        }[];
    };
    rds: {
        aurora: {
            mysql: {
                region: string;
                secretArn: string | undefined;
                resourceArn: string | undefined;
                databaseName: string | undefined;
                databaseCredentialsSecretsManagerId: string | undefined;
            };
        };
    };
    secretsManager: {
        region: string;
    };
};
export default _default;
