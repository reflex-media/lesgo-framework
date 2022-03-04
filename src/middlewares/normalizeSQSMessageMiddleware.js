import logger from '../utils/logger';
import isEmpty from '../utils/isEmpty';

const FILE = 'Lesgo/middlewares/normalizeSQSMessageMiddleware';

export const normalizeHandler = records => {
  let recordCount = 0;

  if (!records || records === null || Object.keys(records).length === 0) {
    recordCount = null;
  } else {
    recordCount = Object.keys(records).length;
  }

  logger.addMeta({ recordCount });

  if (recordCount === null) return null;

  return Object.values(records).map(record => ({
    messageId: record.messageId,
    receiptHandle: record.receiptHandle,
    ...JSON.parse(record.body),
  }));
};

export const disconnectConnections = async opts => {
  try {
    if (!isEmpty(opts.cache)) await opts.cache.end();
    if (!isEmpty(opts.db)) await opts.db.end();
    if (!isEmpty(opts.dbRead)) await opts.dbRead.end();
  } catch (err) {
    logger.error(`${FILE}::Failed to end connection`, err);
  }
};

/**
 * Normalizes handler.event.Records as handler.event.collections Object.
 * This type of request is received by SQS listeners
 */
/* istanbul ignore next */
const normalizeSQSMessageMiddleware /* istanbul ignore next */ = opts => {
  return {
    before: (handler, next) => {
      const { Records } = handler.event;
      // eslint-disable-next-line no-param-reassign
      handler.event.collection = normalizeHandler(Records);
      next();
    },
    after: async (handler, next) => {
      await disconnectConnections(opts);
      next();
    },
    onError: async (handler, next) => {
      await disconnectConnections(opts);
      next();
    },
  };
};

export default normalizeSQSMessageMiddleware;
