import deleteMessage from './deleteMessage';
import dispatch from './dispatch';
import getClient from './getClient';
import receiveMessages from './receiveMessages';
export { deleteMessage, dispatch, getClient, receiveMessages };
declare const _default: {
    deleteMessage: (queue: string | import("../../services/SQSService/getQueueUrl").Queue, receiptHandle: string, opts?: import("../../services/SQSService/deleteMessage").DeleteMessageOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<void>;
    dispatch: (payload: Record<any, any>, queue: string | import("../../services/SQSService/getQueueUrl").Queue, opts?: import("../../services/SQSService/dispatch").DispatchOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
    getClient: (clientOpts?: import("../../types/aws").ClientOptions | undefined) => import("@aws-sdk/client-sqs").SQSClient;
    receiveMessages: (queue: string | import("../../services/SQSService/getQueueUrl").Queue, opts?: import("../../services/SQSService/receiveMessages").ReceiveMessagesOptions | undefined, clientOpts?: import("../../types/aws").ClientOptions | undefined) => Promise<import("@aws-sdk/client-sqs").ReceiveMessageCommandOutput>;
};
export default _default;
