import getClient from './getClient';
import dispatch from './dispatch';
export { getClient, dispatch };
declare const _default: {
    getClient: ({ region, singletonConn }: import("./getClient").GetClientOptions) => import("@aws-sdk/client-sqs").SQSClient;
    dispatch: (payload: Record<any, any>, queue: import("./dispatch").Queue, { region, singletonConn }: {
        region: string;
        singletonConn: string;
    }) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
};
export default _default;
