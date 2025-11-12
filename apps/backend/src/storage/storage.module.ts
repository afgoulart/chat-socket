import { Module, Global } from '@nestjs/common';
import { Storage } from './storage.interface';
import { LowDBStorage } from './lowdb.storage';
import { InMemoryStorage } from './inmemory.storage';

@Global()
@Module({
  providers: [
    {
      provide: 'STORAGE',
      useFactory: () => {
        const dbType = process.env.DATABASE_TYPE || 'lowdb';

        console.log(`[Storage] Initializing storage type: ${dbType}`);

        switch (dbType.toLowerCase()) {
          case 'lowdb':
            return new LowDBStorage();

          case 'inmemory':
            return new InMemoryStorage();

          case 'mongodb':
            throw new Error('MongoDB storage not implemented yet. Please implement MongoDBStorage class.');

          case 'postgres':
          case 'postgresql':
            throw new Error('PostgreSQL storage not implemented yet. Please implement PostgresStorage class.');

          case 'mysql':
            throw new Error('MySQL storage not implemented yet. Please implement MySQLStorage class.');

          default:
            console.warn(`[Storage] Unknown database type: ${dbType}. Falling back to LowDB.`);
            return new LowDBStorage();
        }
      },
    },
  ],
  exports: ['STORAGE'],
})
export class StorageModule {}
