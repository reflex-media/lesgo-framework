export type Queue = {
    alias: string;
    name: string;
    url: string;
};
declare const dispatch: (payload: Record<any, any>, queue: Queue, { region, singletonConn, fifo, messageGroupId, messageDeduplicationId, }: {
    region: string;
    singletonConn: string;
    fifo?: boolean | undefined;
    messageGroupId?: string | undefined;
    messageDeduplicationId?: string | undefined;
}) => Promise<import("@aws-sdk/client-sqs").SendMessageCommandOutput>;
export default dispatch;
