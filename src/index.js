import WebSocket from 'ws'
import { map, remove } from 'lodash'
import redis from 'redis'
import { MessageChannel } from './config'

import WebSocketConnection from './websocket/websocket_connection'
import { register as registerEvent } from './websocket/event_registry'
import { Reminder } from './models'

const redisSubcriber = redis.createClient()
redisSubcriber.subscribe(MessageChannel)
// TODO: Add config env
const PORT = 8080

const Connections = []

async function addReminder({ name, time }) {
  const reminder = new Reminder({ name, time })
  await reminder.save()
  return reminder
}

registerEvent('add', addReminder)

function removeConnection(connection) {
  remove(Connections, (connection) => connection === connection)
}

function addConnection(ws) {
  const connection = new WebSocketConnection(ws)
  connection.on('close', removeConnection)
  Connections.push(connection)
}

function notifyAllConnectingClient(reminder) {
  return map(Connections, (connection) => {
    connection.reply(reminder.name)
  })
}

const wss = new WebSocket.Server({ port: PORT })
wss.on('connection', addConnection)

redisSubcriber.on('message', (_channel, message) => {
  const reminderIds = JSON.parse(message)
  return Promise.all(
    map(reminderIds, async (reminderId) => {
      const reminder = await Reminder.find(reminderId)
      return notifyAllConnectingClient(reminder)
    })
  )
})
