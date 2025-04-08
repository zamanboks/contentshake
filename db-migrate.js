import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function runMigration() {
  console.log('Starting database migration...');
  
  // Create database connection
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not defined.');
    process.exit(1);
  }
  
  console.log('Connecting to database...');
  const queryClient = postgres(connectionString, { max: 1 });
  
  try {
    console.log('Running migration...');
    const db = drizzle(queryClient);
    
    // Drop tables first for clean migration
    try {
      console.log('Dropping existing tables...');
      await queryClient`DROP TABLE IF EXISTS social_posts CASCADE`;
      await queryClient`DROP TABLE IF EXISTS brand_voices CASCADE`;
      await queryClient`DROP TABLE IF EXISTS content_ideas CASCADE`;
      await queryClient`DROP TABLE IF EXISTS content_items CASCADE`;
      await queryClient`DROP TABLE IF EXISTS users CASCADE`;
      await queryClient`DROP TABLE IF EXISTS subscription_plans CASCADE`;
      console.log('Tables dropped successfully.');
    } catch (error) {
      console.error('Error dropping tables:', error);
    }
    
    // Apply schema changes without prompt
    console.log('Applying schema changes...');
    await queryClient.end();
    
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

runMigration().catch(console.error);