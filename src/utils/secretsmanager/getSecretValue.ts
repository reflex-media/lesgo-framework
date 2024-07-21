import getSecretValueService from '../../services/SecretsManagerService/getSecretValue';
import secretsManagerConfig from '../../config/secretsManager';
import isEmpty from '../isEmpty';
import validateFields from '../validateFields';

const getSecretValue = async (
  secretId: string,
  { singletonConn = 'default', region = '' } = {}
) => {
  region = isEmpty(region) ? secretsManagerConfig.region : region;

  const input = validateFields({ secretId, singletonConn, region }, [
    { key: 'secretId', type: 'string', required: true },
    { key: 'singletonConn', type: 'string', required: true },
    { key: 'region', type: 'string', required: true },
  ]);

  return getSecretValueService(input.secretId, {
    singletonConn: input.singletonConn,
    region: input.region,
  });
};

export default getSecretValue;
