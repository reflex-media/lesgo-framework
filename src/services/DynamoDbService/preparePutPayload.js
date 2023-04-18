const preparePutPayload = (tableName, item) => {
  return {
    TableName: tableName,
    Item: item,
  };
};

export default preparePutPayload;
