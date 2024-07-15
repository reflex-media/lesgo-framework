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
};
export default _default;
