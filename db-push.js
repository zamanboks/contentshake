import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from './shared/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// For migrations
const migrationClient = postgres(connectionString, { max: 1 });
const db = drizzle(migrationClient, { schema });

async function main() {
  try {
    console.log('Pushing schema to database...');
    // This is similar to a migration but directly pushes the schema
    await db.execute(schema.contentIdeas.toSQL());
    await db.execute(schema.users.toSQL());
    await db.execute(schema.contentItems.toSQL());
    await db.execute(schema.brandVoices.toSQL());
    await db.execute(schema.socialPosts.toSQL());
    console.log('Schema push completed successfully');
  } catch (error) {
    console.error('Error pushing schema to database:', error);
    process.exit(1);
  } finally {
    await migrationClient.end();
  }
}

main();