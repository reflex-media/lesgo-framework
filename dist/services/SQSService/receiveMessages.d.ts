export type Queue = {
    alias: string;
    name: string;
    url: string;
};
declare const receiveMessages: (queue: Queue, { region, singletonConn, maxNumberOfMessages, waitTimeSeconds, }: {
    region: string;
    singletonConn: string;
    maxNumberOfMessages?: number | undefined;
    waitTimeSeconds?: number | undefined;
}) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
export default receiveMessages;
