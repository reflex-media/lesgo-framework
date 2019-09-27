import logger from '../utils/logger';

export const normalizeHandler = records => {
  let recordCount = 0;

  if (!records || records === null || Object.keys(records).length === 0) {
    recordCount = null;
  } else {
    recordCount = Object.keys(records).length;
  }

  // attach additional SQS message metadata in the logger
  logger.withMeta = logger.child({
    recordCount,
  });

  if (recordCount === null) return null;

  return Object.values(records).map(record => ({
    messageId: record.messageId,
    receiptHandle: record.receiptHandle,
    ...JSON.parse(record.body),
  }));
};

/**
 * Normalizes handler.event.Records as handler.event.collections Object.
 * This type of request is received by SQS listeners
 */
const normalizeSQSMessage /* istanbul ignore next */ = () => {
  return {
    before: (handler, next) => {
      const { Records } = handler.event;
      // eslint-disable-next-line no-param-reassign
      handler.event.collection = normalizeHandler(Records);
      next();
    },
  };
};

export default normalizeSQSMessage;
