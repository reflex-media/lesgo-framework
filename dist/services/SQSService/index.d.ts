import dispatch from './dispatch';
import getClient from './getClient';
import receiveMessages from './receiveMessages';
export { dispatch, getClient, receiveMessages };
declare const _default: {
    dispatch: (payload: Record<any, any>, queue: import("./dispatch").Queue, { region, singletonConn, fifo, messageGroupId, messageDeduplicationId, }: {
        region: string;
        singletonConn: string;
        fifo?: boolean | undefined;
        messageGroupId?: string | undefined;
        messageDeduplicationId?: string | undefined;
    }) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
    getClient: ({ region, singletonConn }: import("./getClient").GetClientOptions) => import("@aws-sdk/client-sqs").SQSClient;
    receiveMessages: (queue: import("./receiveMessages").Queue, { region, singletonConn, maxNumberOfMessages, waitTimeSeconds, }: {
        region: string;
        singletonConn: string;
        maxNumberOfMessages?: number | undefined;
        waitTimeSeconds?: number | undefined;
    }) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
};
export default _default;
