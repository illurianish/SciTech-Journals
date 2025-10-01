import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        // Connection timeout
        connectTimeout: 10000,
        // Command timeout
        commandTimeout: 5000,
        // Keep alive
        keepAlive: 30000,
      };

      // Remove password if not provided
      if (!redisConfig.password) {
        delete redisConfig.password;
      }

      this.client = new Redis(redisConfig);

      // Event handlers
      this.client.on('connect', () => {
        console.log('✅ Redis connected successfully');
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.client.on('ready', () => {
        console.log('✅ Redis ready to accept commands');
      });

      this.client.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
        this.isConnected = false;
      });

      this.client.on('close', () => {
        console.log('⚠️ Redis connection closed');
        this.isConnected = false;
      });

      this.client.on('reconnecting', (time) => {
        this.reconnectAttempts++;
        console.log(`🔄 Redis reconnecting in ${time}ms (attempt ${this.reconnectAttempts})`);
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error('❌ Max Redis reconnection attempts reached');
          this.client.disconnect();
        }
      });

      // Test the connection
      await this.client.connect();
      await this.client.ping();
      
      console.log('🎯 Redis client initialized and tested successfully');
      return this.client;

    } catch (error) {
      console.error('❌ Failed to initialize Redis client:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Get data from Redis cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} Cached data or null if not found
   */
  async get(key) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('⚠️ Redis not connected, skipping cache get');
        return null;
      }

      const data = await this.client.get(key);
      if (data) {
        console.log(`🎯 Cache HIT for key: ${key}`);
        return JSON.parse(data);
      } else {
        console.log(`❌ Cache MISS for key: ${key}`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Redis GET error for key ${key}:`, error.message);
      return null; // Graceful degradation
    }
  }

  /**
   * Set data in Redis cache
   * @param {string} key - Cache key
   * @param {any} value - Data to cache
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async set(key, value, ttl = 300) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('⚠️ Redis not connected, skipping cache set');
        return false;
      }

      const serializedValue = JSON.stringify(value);
      await this.client.setex(key, ttl, serializedValue);
      console.log(`✅ Cache SET for key: ${key} (TTL: ${ttl}s)`);
      return true;
    } catch (error) {
      console.error(`❌ Redis SET error for key ${key}:`, error.message);
      return false; // Graceful degradation
    }
  }

  /**
   * Delete data from Redis cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Success status
   */
  async del(key) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('⚠️ Redis not connected, skipping cache delete');
        return false;
      }

      const result = await this.client.del(key);
      console.log(`🗑️ Cache DELETE for key: ${key} (deleted: ${result})`);
      return result > 0;
    } catch (error) {
      console.error(`❌ Redis DELETE error for key ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Delete multiple keys matching a pattern
   * @param {string} pattern - Key pattern (e.g., 'user:*', 'property:123:*')
   * @returns {Promise<number>} Number of keys deleted
   */
  async delPattern(pattern) {
    try {
      if (!this.isConnected || !this.client) {
        console.warn('⚠️ Redis not connected, skipping pattern delete');
        return 0;
      }

      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        console.log(`🔍 No keys found for pattern: ${pattern}`);
        return 0;
      }

      const result = await this.client.del(...keys);
      console.log(`🗑️ Cache DELETE pattern: ${pattern} (deleted ${result} keys)`);
      return result;
    } catch (error) {
      console.error(`❌ Redis DELETE pattern error for ${pattern}:`, error.message);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   * @param {string} key - Cache key
   * @returns {Promise<boolean>} Key existence status
   */
  async exists(key) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`❌ Redis EXISTS error for key ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Set TTL for existing key
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in seconds
   * @returns {Promise<boolean>} Success status
   */
  async expire(key, ttl) {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      const result = await this.client.expire(key, ttl);
      console.log(`⏰ Cache EXPIRE for key: ${key} (TTL: ${ttl}s)`);
      return result === 1;
    } catch (error) {
      console.error(`❌ Redis EXPIRE error for key ${key}:`, error.message);
      return false;
    }
  }

  /**
   * Get cache statistics
   * @returns {Promise<object>} Cache statistics
   */
  async getStats() {
    try {
      if (!this.isConnected || !this.client) {
        return { connected: false };
      }

      const info = await this.client.info('stats');
      const memory = await this.client.info('memory');
      
      return {
        connected: this.isConnected,
        info: info,
        memory: memory
      };
    } catch (error) {
      console.error('❌ Redis STATS error:', error.message);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Clear entire cache (use with caution)
   * @returns {Promise<boolean>} Success status
   */
  async flushAll() {
    try {
      if (!this.isConnected || !this.client) {
        return false;
      }

      await this.client.flushall();
      console.log('🧹 Cache FLUSH ALL completed');
      return true;
    } catch (error) {
      console.error('❌ Redis FLUSH ALL error:', error.message);
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
        console.log('👋 Redis connection closed gracefully');
      }
    } catch (error) {
      console.error('❌ Error closing Redis connection:', error.message);
    }
  }

  /**
   * Get connection status
   * @returns {boolean} Connection status
   */
  isReady() {
    return this.isConnected && this.client && this.client.status === 'ready';
  }
}

// Create singleton instance
const redisClient = new RedisClient();

// Manual cache invalidation functions
export const cacheInvalidation = {
  /**
   * Clear property-related cache
   * @param {string} propertyId - Property ID
   */
  clearPropertyCache: async (propertyId) => {
    const patterns = [
      `property:${propertyId}:*`,
      `property_details:${propertyId}*`,
      `calculate:${propertyId}*`
    ];
    
    let totalDeleted = 0;
    for (const pattern of patterns) {
      totalDeleted += await redisClient.delPattern(pattern);
    }
    
    console.log(`🧹 Cleared ${totalDeleted} property cache entries for property: ${propertyId}`);
    return totalDeleted;
  },

  /**
   * Clear user-specific RAG cache
   * @param {string} userId - User ID
   */
  clearUserRagCache: async (userId) => {
    const pattern = `rag:${userId}:*`;
    const deleted = await redisClient.delPattern(pattern);
    console.log(`🧹 Cleared ${deleted} RAG cache entries for user: ${userId}`);
    return deleted;
  },

  /**
   * Clear specific RAG query cache
   * @param {string} userId - User ID
   * @param {string} queryHash - Query hash
   */
  clearRagQueryCache: async (userId, queryHash) => {
    const key = `rag:${userId}:${queryHash}`;
    const deleted = await redisClient.del(key);
    console.log(`🧹 Cleared RAG query cache: ${key}`);
    return deleted;
  },

  /**
   * Clear all cache (emergency function)
   */
  clearAllCache: async () => {
    const result = await redisClient.flushAll();
    console.log('🧹 Cleared ALL cache entries');
    return result;
  }
};

export default redisClient;


