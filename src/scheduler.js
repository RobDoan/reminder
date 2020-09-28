import util from 'util'
import redis from 'redis'
import moment from 'moment'
import { MessageChannel } from './config'
import { SCHEDULER_KEY_NAME } from './models'
const redisClient = redis.createClient()

const zrangeByScore = util
  .promisify(redisClient.zrangebyscore)
  .bind(redisClient)

const INTERVAL_TIME = 5000 //  5 seconds
let schedulerPid

function upCommingReminderIds() {
  const currentTime = moment().unix()
  return zrangeByScore(
    SCHEDULER_KEY_NAME,
    currentTime,
    currentTime + INTERVAL_TIME / 1000
  )
}

async function getAndNotifiy() {
  const reminderIds = await upCommingReminderIds()
  if (reminderIds.length > 0) {
    redisClient.publish(MessageChannel, JSON.stringify(reminderIds))
  }
}

function startScheduler() {
  if (schedulerPid) clearInterval(schedulerPid)
  schedulerPid = setInterval(getAndNotifiy, INTERVAL_TIME)
}

startScheduler()
