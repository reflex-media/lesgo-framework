import { connectWriteDb, connectReadDb } from './dbConnect';

export const connectDb = (conn = null) => {
  connectWriteDb(conn);
  connectReadDb(conn);
};

export const db = connectWriteDb();

export const dbRead = connectReadDb();
