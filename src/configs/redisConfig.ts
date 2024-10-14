import Redis from 'ioredis';

const { REDIS_URL } = process.env;
if (!REDIS_URL) {
  throw 'Redis configuration not found.';
}

const redis = new Redis(REDIS_URL);

export const getContext = async (userId: string) => {
  return await redis.get(`context:${userId}`);
};

export const updateContext = async (userId: string, context: string) => {
  await redis.set(`context:${userId}`, context);
};
