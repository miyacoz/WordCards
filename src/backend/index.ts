import * as Https from 'https'
import { createProxyServer } from 'http-proxy'
import * as Url from 'url'
import * as Dotenv from 'dotenv'
import * as Fs from 'fs'

if (Dotenv.config().error) {
  throw Dotenv.config().error
}

const serverOptions = {
  key: Fs.readFileSync(Dotenv.config().parsed.SSL_KEY),
  cert: Fs.readFileSync(Dotenv.config().parsed.SSL_CERT)
}

const SERVER_PORT = 8888

const routes = (q, r): void => {
  const query = Url.parse(q.url, true)
  console.log(query)

  const headers = {
    'Content-Type': 'text/plain',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  }
  r.writeHead(200, headers)
  const data = {
    data: {
      it: 'good'
    }
  }
  r.write(JSON.stringify(data))
  r.end()
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
console.log('i\'m running now')
