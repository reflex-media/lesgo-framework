export type Queue = {
    alias: string;
    name: string;
    url: string;
};
declare const deleteMessage: (queue: Queue, receiptHandle: string, { region, singletonConn, }: {
    region: string;
    singletonConn: string;
}) => Promise<void>;
export default deleteMessage;
