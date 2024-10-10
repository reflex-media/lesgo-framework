import { Queue } from '../../services/SQSService/getQueueUrl';
export declare const convertQueueAliasToObject: (queueAlias: string | string[]) => Queue | Queue[];
export default convertQueueAliasToObject;
