export default {
  redis: {
    endpoint: process.env.LESGO_AWS_ELASTICACHE_REDIS_ENDPOINT,
    port: Number(process.env.LESGO_AWS_ELASTICACHE_REDIS_PORT || 6379),
  },
};
