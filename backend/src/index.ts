import * as Fs from 'fs'
import * as Http from 'http'
import * as Https from 'https'

import Config from './Config'
import DB from './DB'

const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(Config.SSL_KEY || ''),
  cert: Fs.readFileSync(Config.SSL_CERT || '')
}

const SERVER_PORT: number = Number(Config.SERVER_PORT) || 0

const routes: Http.RequestListener = (q: Http.IncomingMessage, r: Http.ServerResponse): void => {
  q.on('data', chunk => {
    console.log(JSON.parse(chunk.toString()))
  })

  const headers: Http.OutgoingHttpHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  r.writeHead(200, headers)

  const now = new Date()
  const data = {
    data: {
      it: 'good'
    },
    now
  }
  r.write(Number(now) % 2 ? JSON.stringify(data) : '[]')
  r.end()
}

new DB(Config)
Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.info('i\'m running now')
