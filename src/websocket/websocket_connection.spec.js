/* eslint-disable jest/no-done-callback */
import WebSocket from 'ws'
import WebSocketConnection from './websocket_connection'
import { register, processorForEvent } from './event_registry'
describe('WebsocketConnection', () => {
  describe('#EventListener', () => {
    let wss, spySocketSend
    beforeEach(() => {
      wss = new WebSocket.Server({ port: 0 })
    })

    afterEach(() => {
      if (spySocketSend) spySocketSend.mockRestore()
      wss.close()
    })

    it('should register #pongHandler for pong event', (done) => {
      wss.on('connection', (wsc) => {
        const webSocketConnection = new WebSocketConnection(wsc)
        const pongListeners = wsc.listeners('pong')
        expect(pongListeners).toContain(webSocketConnection.onPongHandler)
        done()
      })
      // eslint-disable-next-line no-unused-vars
      const ws = new WebSocket(`ws://localhost:${wss.address().port}`)
    })

    it('should register #onMessageHandler for message event', (done) => {
      wss.on('connection', (wsc) => {
        const webSocketConnection = new WebSocketConnection(wsc)
        const messageListeners = wsc.listeners('message')
        expect(messageListeners).toContain(webSocketConnection.onMessageHandler)
        done()
      })

      const ws = new WebSocket(`ws://localhost:${wss.address().port}`)
      ws.on('open', () => {
        ws.send('Hello')
      })
    })

    it('reply message', (done) => {
      wss.on('connection', (wsc) => {
        const webSocketConnection = new WebSocketConnection(wsc)
        webSocketConnection.reply('Testing')
      })

      const ws = new WebSocket(`ws://localhost:${wss.address().port}`)
      ws.on('message', (message) => {
        expect(message).toEqual('Testing')
        done()
      })
    })

    it('#onMessageHandler', async () => {
      const mockSocket = { on: jest.fn() }
      const webSocketConnection = new WebSocketConnection(mockSocket)
      const eventMessage = JSON.stringify({ command: 'add', data: 'data' })
      const addReminder = jest.fn()
      register('add', addReminder)
      await webSocketConnection.onMessageHandler(eventMessage)
      return expect(addReminder).toBeCalled()
    })
  })
})
