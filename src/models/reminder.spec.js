import { reject } from 'lodash'
import { redisClient } from '../redis'
import Reminder from './reminder'
describe('Reminder', () => {
  let reminder
  beforeEach(() => {
    reminder = new Reminder({
      name: 'Quy Test',
      time: '2020-10-10 10:00:00'
    })
    return reminder.save().then(() => console.info('SUCCESS'))
  })

  afterAll(async () => {
    await redisClient.flushall()
    return redisClient.quit()
  })

  it('#save', () => {
    return new Promise((resolve) => {
      redisClient.hgetall(reminder.id, (_k, data) => {
        expect(data.name).toBe('Quy Test')
        expect(data.time).toBe('2020-10-10 10:00:00')
        resolve(true)
      })
    })
  })

  it('#find', async () => {
    const loadedReminder = await Reminder.find(reminder.id)
    expect(loadedReminder.name).toBe('Quy Test')
  })

  it('#delete', async () => {
    await reminder.delete()
    return new Promise((resolve) => {
      redisClient.exists(reminder.id, (result) => {
        expect(result).toBeFalsy()
        resolve()
      })
    })
  })
})
