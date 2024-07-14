export type Queue = {
    alias: string;
    name: string;
    url: string;
};
declare const dispatch: (payload: Record<any, any>, queue: Queue, { region, singletonConn }: {
    region: string;
    singletonConn: string;
}) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
