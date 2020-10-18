import * as Https from 'https'
import * as Dotenv from 'dotenv'
import * as Fs from 'fs'
import * as Http from 'http'
// import * as HttpProxy from 'http-proxy'

const dotenvResult: Dotenv.DotenvConfigOutput = Dotenv.config()
if (dotenvResult.error) {
  throw dotenvResult.error
}

const config = dotenvResult.parsed
const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(config?.SSL_KEY || ''),
  cert: Fs.readFileSync(config?.SSL_CERT || '')
}

const SERVER_PORT = 8888

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
  const data = {
    data: {
      it: 'good'
    },
    now: new Date()
  }
  r.write(JSON.stringify(data))
  r.end()
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.log('i\'m running now')
