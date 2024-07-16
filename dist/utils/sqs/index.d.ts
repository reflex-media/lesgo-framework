import dispatch from './dispatch';
import getClient from './getClient';
import receiveMessages from './receiveMessages';
export { dispatch, getClient, receiveMessages };
declare const _default: {
    dispatch: (payload: Record<any, any>, queue: string | import("../../services/SQSService/dispatch").Queue, opts?: import("./dispatch").DispatchOptions) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => import("@aws-sdk/client-sqs").SQSClient;
    receiveMessages: (queue: string | import("../../services/SQSService/receiveMessages").Queue, opts?: import("./receiveMessages").ReceiveMessagesOptions) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
};
export default _default;
