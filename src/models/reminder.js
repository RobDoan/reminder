import util from 'util'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { redisClient } from '../redis'

export const SCHEDULER_KEY_NAME = 'SORT_SCHEDULE_KEY'

const redisHset = util.promisify(redisClient.hset).bind(redisClient)
const redisHget = util.promisify(redisClient.hgetall).bind(redisClient)
const redisDel = util.promisify(redisClient.del).bind(redisClient)
const redisZadd = util.promisify(redisClient.zadd).bind(redisClient)
const redisZrem = util.promisify(redisClient.zrem).bind(redisClient)

export default class Reminder {
  constructor({ id, name, time }) {
    this.id = id || uuidv4()
    this.name = name
    this.time = time
  }

  get unixTime() {
    return moment(this.time).unix()
  }

  static find(id) {
    return redisHget(id).then((data) => {
      return new Reminder({ id, ...data })
    })
  }

  async save() {
    await redisHset(this.id, 'name', this.name, 'time', this.time)
    await redisZadd(SCHEDULER_KEY_NAME, this.unixTime, this.id)
    return this
  }

  async delete() {
    if (this.id) {
      await redisDel(this.id)
      await redisZrem(SCHEDULER_KEY_NAME, this.id)
    }
    return this
  }
}
