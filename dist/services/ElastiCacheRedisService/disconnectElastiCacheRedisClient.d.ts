/**
 * Disconnects the ElastiCache Redis client.
 *
 * It is important to disconnect the ElastiCache Redis client
 * when it is no longer needed to prevent memory leaks and to free up resources,
 * especially for serverless applications on Lambda function.
 *
 * @returns {Promise<void>} A promise that resolves when the disconnection is completed.
 */
declare const disconnectElastiCacheRedisClient: () => Promise<void>;
export default disconnectElastiCacheRedisClient;
