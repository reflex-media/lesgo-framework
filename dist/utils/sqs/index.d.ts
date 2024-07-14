import dispatch from './dispatch';
import getClient from './getClient';
export { dispatch, getClient };
declare const _default: {
    dispatch: (payload: Record<any, any>, queue: string | import("../../services/SQSService/dispatch").Queue, { singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
    getClient: ({ singletonConn, region }?: {
        singletonConn?: string | undefined;
        region?: string | undefined;
    }) => import("@aws-sdk/client-sqs").SQSClient;
};
export default _default;
