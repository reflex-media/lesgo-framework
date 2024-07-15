import { Item } from '../../services/DynamoDbService/putRecord';
declare const putRecord: (item: Item, tableName: string, { singletonConn, region }?: {
    singletonConn?: string | undefined;
    region?: string | undefined;
}) => Promise<import("@aws-sdk/lib-dynamodb").PutCommandOutput>;
export default putRecord;
