/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🧬 ORUS BUILDER - MOCK DATABASE (IN-MEMORY)
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { logger } from './logging-system';

interface MockDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: any;
}

class MockDatabase {
  private collections: Map<string, MockDocument[]> = new Map();
  private connected: boolean = false;

  async connect(): Promise<void> {
    logger.info('🔌 Connecting to Mock Database...');
    
    // Initialize collections
    this.collections.set('users', []);
    this.collections.set('projects', []);
    this.collections.set('blueprints', []);
    this.collections.set('generations', []);
    
    this.connected = true;
    logger.info('✅ Mock Database connected (in-memory)');
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.collections.clear();
    logger.info('✅ Mock Database disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  // INSERT
  async insert(collection: string, doc: any): Promise<MockDocument> {
    if (!this.collections.has(collection)) {
      this.collections.set(collection, []);
    }

    const newDoc: MockDocument = {
      id: this.generateId(),
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.collections.get(collection)!.push(newDoc);
    
    logger.debug(`Inserted document in ${collection}`, {
      component: 'MockDatabase',
      metadata: { id: newDoc.id }
    });

    return newDoc;
  }

  // FIND ALL
  async find(collection: string, query: any = {}): Promise<MockDocument[]> {
    const docs = this.collections.get(collection) || [];
    
    if (Object.keys(query).length === 0) {
      return docs;
    }

    // Simple query matching
    return docs.filter(doc => {
      return Object.keys(query).every(key => doc[key] === query[key]);
    });
  }

  // FIND ONE
  async findOne(collection: string, query: any): Promise<MockDocument | null> {
    const docs = await this.find(collection, query);
    return docs[0] || null;
  }

  // FIND BY ID
  async findById(collection: string, id: string): Promise<MockDocument | null> {
    return this.findOne(collection, { id });
  }

  // UPDATE
  async update(collection: string, id: string, updates: any): Promise<MockDocument | null> {
    const docs = this.collections.get(collection) || [];
    const docIndex = docs.findIndex(d => d.id === id);

    if (docIndex === -1) return null;

    docs[docIndex] = {
      ...docs[docIndex],
      ...updates,
      updatedAt: new Date()
    };

    logger.debug(`Updated document in ${collection}`, {
      component: 'MockDatabase',
      metadata: { id }
    });

    return docs[docIndex];
  }

  // DELETE
  async delete(collection: string, id: string): Promise<boolean> {
    const docs = this.collections.get(collection) || [];
    const initialLength = docs.length;
    
    const filtered = docs.filter(d => d.id !== id);
    this.collections.set(collection, filtered);

    const deleted = filtered.length < initialLength;
    
    if (deleted) {
      logger.debug(`Deleted document in ${collection}`, {
        component: 'MockDatabase',
        metadata: { id }
      });
    }

    return deleted;
  }

  // COUNT
  async count(collection: string, query: any = {}): Promise<number> {
    const docs = await this.find(collection, query);
    return docs.length;
  }

  // CLEAR COLLECTION
  async clear(collection: string): Promise<void> {
    this.collections.set(collection, []);
    logger.debug(`Cleared collection: ${collection}`);
  }

  // HEALTH CHECK
  async healthCheck(): Promise<{ isHealthy: boolean; responseTime: number }> {
    const start = Date.now();
    const isHealthy = this.connected;
    const responseTime = Date.now() - start;

    return { isHealthy, responseTime };
  }

  // STATISTICS
  getStatistics(): any {
    const stats: any = {
      connected: this.connected,
      collections: {}
    };

    this.collections.forEach((docs, name) => {
      stats.collections[name] = docs.length;
    });

    return stats;
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const mockDatabase = new MockDatabase();
