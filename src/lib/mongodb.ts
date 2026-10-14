import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'store';

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise(): Promise<MongoClient> | null {
  const connectionUri = process.env.MONGODB_URI;
  if (!connectionUri) {
    return null;
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(connectionUri);
      global._mongoClientPromise = client.connect().catch((err) => {
        // Reset cached promise on failure so subsequent attempts can retry
        global._mongoClientPromise = undefined;
        throw err;
      });
    }
    return global._mongoClientPromise;
  } else {
    if (!clientPromise) {
      client = new MongoClient(connectionUri);
      clientPromise = client.connect().catch((err) => {
        clientPromise = null;
        throw err;
      });
    }
    return clientPromise;
  }
}

export async function getMongoDb(): Promise<Db | null> {
  try {
    const promise = getMongoClientPromise();
    if (!promise) {
      return null;
    }
    const client = await promise;
    return client.db(dbName);
  } catch (error) {
    console.warn('[MongoDB] Could not connect to database, falling back to local store:', error instanceof Error ? error.message : error);
    return null;
  }
}
