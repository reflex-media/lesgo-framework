import { GetClientOptions } from '../../services/DynamoDbService/getClient';
declare const getClient: (opts?: GetClientOptions) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
export default getClient;
