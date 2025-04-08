import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

// Create the Postgres client
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection pool for Drizzle ORM
export const pool = postgres(connectionString, {
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 30, // How long a connection can be idle before being closed
});

// For Drizzle ORM
const queryClient = postgres(connectionString);
export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, { schema });