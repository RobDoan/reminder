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

function addConnection(ws) {
  const connection = new WebSocketConnection(ws)
  Connections.push(connection)
}

function removeConnection(closeEvent) {
  const { target } = closeEvent
  remove(Connections, (connection) => connection.ws === target)
}

function notifyAllConnectingClient(reminder) {
  return map(Connections, (connection) => {
    connection.reply(reminder.name)
  })
}

const wss = new WebSocket.Server({ port: PORT })
wss.on('connection', addConnection)
wss.on('close', removeConnection)

redisSubcriber.on('message', (_channel, message) => {
  const reminderIds = JSON.parse(message)
  return Promise.all(
    map(reminderIds, async (reminderId) => {
      const reminder = await Reminder.find(reminderId)
      return notifyAllConnectingClient(reminder)
    })
  )
})
