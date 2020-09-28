import redis from 'redis'
// TODO: add enviroment
export const redisClient = redis.createClient()
