import { Context, SQSEvent, SQSRecord } from 'aws-lambda';
import logger from '../utils/logger';
import { MiddyNext } from '../types/MiddyTypes';
import disconnectOpenConnections from './disconnectOpenConnections';

const FILE = 'lesgo/middlewares/normalizeSQSMessageMiddleware';

interface SqsMiddlewareHandler {
  event: SQSEvent & { collection: any[] | null };
  context: Context;
}

export const normalizeSqsHandler = (records: SQSRecord[]) => {
  let recordCount: number | null = 0;

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

export const disconnectConnections = async () => {
  try {
    await disconnectOpenConnections();
  } catch (err: any) {
    logger.error(`${FILE}::OPEN_CONNECTION_DISCONNECT_FAIL`, err);
  }
};

/**
 * Normalizes handler.event.Records as handler.event.collections Object.
 * This type of request is received by SQS listeners
 */
const sqsMiddleware = () => {
  return {
    before: (handler: SqsMiddlewareHandler, next: MiddyNext) => {
      const { Records } = handler.event;

      // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
      // eslint-disable-next-line no-param-reassign
      handler.context.callbackWaitsForEmptyEventLoop = false;

      // eslint-disable-next-line no-param-reassign
      handler.event.collection = normalizeSqsHandler(Records);
      next();
    },
    after: async (handler: SqsMiddlewareHandler, next: MiddyNext) => {
      // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
      // eslint-disable-next-line no-param-reassign
      handler.context.callbackWaitsForEmptyEventLoop = false;

      await disconnectConnections();
      next();
    },
    onError: async (handler: SqsMiddlewareHandler, next: MiddyNext) => {
      // @see https://middy.js.org/docs/middlewares/do-not-wait-for-empty-event-loop/
      // eslint-disable-next-line no-param-reassign
      handler.context.callbackWaitsForEmptyEventLoop = false;

      await disconnectConnections();
      next();
    },
  };
};

export default sqsMiddleware;
