import queryService from '../../../services/RDSAuroraMySQLDataAPIService/query';
import validateFields from '../../validateFields';

const query = async (
  key: string,
  bucket?: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  const input = validateFields({ key, bucket, singletonConn, region }, [
    { key: 'sql', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);

  return queryService(input.sql, {
    singletonConn: input.singletonConn,
    region: input.region,
  });
};

export default query;
