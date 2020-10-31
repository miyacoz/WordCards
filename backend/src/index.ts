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

enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  OPTIONS = 'options',
}

const routes: Http.RequestListener = (q: Http.IncomingMessage, r: Http.ServerResponse): void => {
  const headers: Http.OutgoingHttpHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  const send = (code: number, data?: object): void => {
    const isDataEmpty = typeof data === 'undefined'
    r.writeHead(code, headers)
    r.write(isDataEmpty ? Buffer.alloc(0) : JSON.stringify(data))
    r.end()
  }

  const route = async (
    routeMethod: HttpMethod,
    routeVerb: string,
    routeAction: ({ params, data }: { params?: string[]; data: object }) => Promise<any>,
    parsedData?: object,
  ): Promise<any> => {
    const pathAndParams = q.url?.split('?')
    const paths = (pathAndParams || [])[0].split('/').filter(v => v && v !== API_PREFIX)
    const verb = paths.shift()
    const params = paths
    const method = q.method?.toLowerCase()

    if (method === routeMethod && verb === routeVerb) {
      try {
        let result: object
        if (parsedData) {
          result = await routeAction({ params, data: parsedData })
        } else {
          // `data` won't be used
          result = await routeAction({ params, data: {} })
        }

        const code = typeof result === 'undefined'
          ? 204
          : method === HttpMethod.PUT
          ? 201
          : 200

        send(code , result)
      } catch (e) {
        console.warn('data process failed', e)
        // TODO return error 4xx/5xx
        send(500)
      }
    }
  }

  q
    .on('data', async chunk => {
      try {
        await route(HttpMethod.POST, 'create', ({ data }) => DB.create(data), JSON.parse(chunk.toString()))
      } catch (e) {
        // TODO return 4xx/5xx
        console.warn('request data parse failed', e)
      }
    })
    .on('end', async () => {
      await route(HttpMethod.GET, 'readAll', () => DB.readAll())
    })

  if (q.method?.toLowerCase() === 'options') {
    send(204)
  }
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
