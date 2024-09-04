import { ClientOptions } from '../../types/aws';
declare const getClient: (opts?: ClientOptions) => import("@aws-sdk/lib-dynamodb").DynamoDBDocumentClient;
export default getClient;
