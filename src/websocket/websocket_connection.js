import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import { processorForEvent } from './event_registry'

export default class WebSocketConnection {
  isAlive = true
  eventHandlers = {}
  constructor(ws) {
    this.id = uuidv4()
    this.ws = ws
    this.ws.on('pong', this.onPongHandler)
    this.ws.on('message', this.onMessageHandler)
    this.ws.on('close', this.closeHanlder)
  }

  on(eventType, handler) {
    this.eventHandlers[eventType] = this.eventHandlers[eventType] || []
    this.eventHandlers[eventType].push(handler)
  }

  off(eventType, handler) {
    if (handler) {
      this.eventHandlers[eventType] = _.reject(
        this.eventHandlers[eventType],
        (fn) => fn === handler
      )
    } else {
      this.eventHandlers[eventType] = []
    }
  }

  onPongHandler = () => {
    this.isAlive = true
  }

  onMessageHandler = async (messageEvent) => {
    const messageJson = JSON.parse(messageEvent)
    const { data } = messageJson
    const { processor } = processorForEvent(messageJson) || {}
    return processor && processor.call(this, data)
  }

  closeHanlder = () => {
    this.isAlive = false
    this.ws.removeEventListener('pong', this.onPongHandler)
    this.ws.removeEventListener('message', this.onMessageHandler)
    this.ws.removeEventListener('close', this.closeHanlder)
    _.map(this.eventHandlers['close'], (fn) => fn.call(this, this))
    this.ws = null
  }

  reply(message) {
    this.ws.send(message)
  }

  disconnect() {
    this.isAlive = false
    this.ws.termiate()
  }
}
