import { v4 as uuidv4 } from 'uuid'
import { processorForEvent } from './event_registry'

export default class WebSocketConnection {
  isAlive = true
  constructor(ws) {
    this.id = uuidv4()
    this.ws = ws
    this.ws.on('pong', this.onPongHandler)
    this.ws.on('message', this.onMessageHandler)
    this.ws.on('close', this.closeHanlder)
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
