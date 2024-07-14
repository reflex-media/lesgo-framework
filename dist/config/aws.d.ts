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
};
export default _default;
