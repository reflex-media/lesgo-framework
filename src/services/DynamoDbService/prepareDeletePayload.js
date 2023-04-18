const prepareDeletePayload = (tableName, key) => {
  return {
    TableName: tableName,
    Key: key,
  };
};

export default prepareDeletePayload;
