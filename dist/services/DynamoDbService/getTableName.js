import { LesgoException } from '../../exceptions';
import dynamodbConfig from '../../config/dynamodb';
const FILE = 'lesgo.services.DynamoDbService.getTableName';
export default tableAlias => {
  const table = dynamodbConfig.tables.find(t => t.alias === tableAlias);
  if (!table) {
    throw new LesgoException(
      'Table not found',
      `${FILE}::TABLE_NOT_FOUND`,
      404,
      { tableAlias }
    );
  }
  return table.name;
};
