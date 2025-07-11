class MongoDBStorage {
    /**
     * @param {import('mongodb').Db} db - Mongoose DB connection's underlying native DB
     */
    constructor(db) {
      this.db = db;
    }
  
    async checkOrCreateCollection(collectionName) {
      const collections = await this.db.listCollections({ name: collectionName }).toArray();
      if (collections.length === 0) {
        console.log(`Creating collection: ${collectionName}`);
        await this.db.createCollection(collectionName);
      } else {
        console.log(`Collection already exists: ${collectionName}`);
      }
    }
  
    async handleIndexesInCollection(collectionName, indexes) {
      const collection = this.db.collection(collectionName);
      for (const idx of indexes) {
        try {
          await collection.createIndex(idx.fields, idx.options);
          console.log(`Index created on ${collectionName}:`, idx.fields);
        } catch (err) {
          console.error(`Failed to create index on ${collectionName}`, err);
        }
      }
    }
  
    async initializeDatabase() {
      const collectionNames = [
        'users',
        'clients',
        'hospitals',
        'cases',
        'finances',
        'invoices',
        'log',
        'providers',
        'counter'
      ];
  
      for (const name of collectionNames) {
        await this.checkOrCreateCollection(name);
      }
  
      // Optional: Add relevant indexes for each collection
      await this.handleIndexesInCollection('users', []);
      await this.handleIndexesInCollection('clients', []);
      await this.handleIndexesInCollection('hospitals', []);
      await this.handleIndexesInCollection('cases', []);
      await this.handleIndexesInCollection('finances', []);
      await this.handleIndexesInCollection('invoices', []);
    }
  }
  
  module.exports = MongoDBStorage;
  