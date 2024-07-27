import awsConfig from './aws';
export default {
  redis: {
    region: process.env.LESGO_AWS_ELASTICACHE_REDIS_REGION || awsConfig.region,
    clusterId: process.env.LESGO_AWS_ELASTICACHE_REDIS_CLUSTER_ID,
    secretId: process.env.LESGO_AWS_ELASTICACHE_REDIS_SECRET_ID,
    endpoint: process.env.LESGO_AWS_ELASTICACHE_REDIS_ENDPOINT,
  },
};
