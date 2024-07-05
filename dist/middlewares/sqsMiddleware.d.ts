import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import { MiddyNext } from '../types/MiddyTypes';
export interface SqsHandler {
    event: SQSEvent & {
        collection: any[] | null;
    };
    context: Context;
}
export declare const normalizeSqsHandler: (records: SQSRecord[]) => any[] | null;
export declare const disconnectConnections: () => Promise<void>;
/**
 * Normalizes handler.event.Records as handler.event.collections Object.
 * This type of request is received by SQS listeners
 */
declare const sqsMiddleware: () => {
    before: (handler: SqsHandler, next: MiddyNext) => void;
    after: (handler: SqsHandler, next: MiddyNext) => Promise<void>;
    onError: (handler: SqsHandler, next: MiddyNext) => Promise<void>;
};
export default sqsMiddleware;
