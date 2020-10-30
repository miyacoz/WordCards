import * as Https from 'https'
import { config as DotenvConfig, DotenvConfigOutput, DotenvParseOutput } from 'dotenv'
import * as Fs from 'fs'
import * as Http from 'http'
// import * as HttpProxy from 'http-proxy'

import DB from './DB'

const dotenvResult: DotenvConfigOutput = DotenvConfig()
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config: DotenvParseOutput | undefined = dotenvResult.parsed

if (!config) {
  throw new Error('no config found')
}

const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(config?.SSL_KEY || ''),
  cert: Fs.readFileSync(config?.SSL_CERT || '')
}

const SERVER_PORT: number = Number(config?.SERVER_PORT) || 0

if (config) {
  new DB(config)
}

const routes: Http.RequestListener = (q, r): void => {
  q.on('readable', () => {
    let chunk: string | Buffer | null = null
    do {
      console.log(chunk, `size: ${chunk?.length || 0}`)
    } while (null !== (chunk = q.read()))
  })

  const headers: Http.OutgoingHttpHeaders = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  }
  r.writeHead(200, headers)

  const now = new Date()
  const data = {
    data: {
      it: 'good'
    },
    now
  }
  r.write(Number(now) % 2 ? JSON.stringify(data) : '')
  r.end()
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.info('i\'m running now')
