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
const API_PREFIX: string = 'api'

const routes: Http.RequestListener = (q: Http.IncomingMessage, r: Http.ServerResponse): void => {
  const headers: Http.OutgoingHttpHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  const pathAndParams = q.url?.split('?')
  const paths = (pathAndParams || [])[0].split('/').filter(v => v && v !== API_PREFIX)
  const method = q.method?.toLowerCase()
  const verb = paths.shift()
  console.log(`method: ${method}, verb: ${verb}`)

  const empty = Buffer.alloc(0)

  q
    .on('data', async chunk => {
      if (method === 'post' && verb === 'create') {
        try {
          const data = JSON.parse(chunk.toString())

          try {
            const record = await DB.create(data)
            r.writeHead(200, headers)
            r.write(JSON.stringify(record))
            r.end()
          } catch (e) {
            console.warn('data could not be created')
          }
        } catch (e) {
          console.warn('request data parse failed')
        }
      } else {
        r.writeHead(400, headers)
        r.write(empty)
        r.end()
      }
    })
    .on('end', async () => {
      if (method === 'get' && verb === 'readAll') {
        try {
          const records = await DB.readAll()
          r.writeHead(200, headers)
          r.write(JSON.stringify(records))
          r.end()
        } catch (e) {
          console.warn('data could not be retrieved')
        }
      }
    })

  if (q.method?.toLowerCase() === 'options') {
    r.writeHead(204, headers)
    r.write(empty)
    r.end()
  }
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
