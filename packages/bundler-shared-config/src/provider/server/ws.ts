import type { Server as HttpServer } from 'node:http'
import type { Http2Server } from 'node:http2'
import type { Server as HttpsServer } from 'node:https'
import WebSocket from '@kmijs/bundler-compiled/compiled/ws'
import { picocolors } from '@kmijs/shared'

export function createWebSocketServer(
  server: HttpServer | HttpsServer | Http2Server,
) {
  const wss = new WebSocket.Server({
    noServer: true,
  })

  // @ts-ignore
  server.on('upgrade', (req, socket, head) => {
    if (req.headers['sec-websocket-protocol'] === 'webpack-hmr') {
      wss.handleUpgrade(req, socket as any, head, (ws) => {
        wss.emit('connection', ws, req)
      })
    }
  })

  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
  })

  wss.on('error', (e: Error & { code: string }) => {
    if (e.code !== 'EADDRINUSE') {
      console.error(
        picocolors.red(`WebSocket server error:\n${e.stack || e.message}`),
      )
    }
  })

  return {
    send(message: string) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    },

    wss,

    close() {
      wss.close()
    },
  }
}
