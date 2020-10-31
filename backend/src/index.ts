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

const headers: Http.OutgoingHttpHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const empty = Buffer.alloc(0)

const routes: Http.RequestListener = (q: Http.IncomingMessage, r: Http.ServerResponse): void => {
  const send = (code: number, data?: object): void => {
    const isDataEmpty = typeof data === 'undefined'
    r.writeHead(code, headers)
    r.write(isDataEmpty ? empty : JSON.stringify(data))
    r.end()
  }

  const pathAndParams = q.url?.split('?')
  const paths = (pathAndParams || [])[0].split('/').filter(v => v && v !== API_PREFIX)
  const verb = paths.shift()
  const params = paths
  const method = q.method?.toLowerCase()

  if (method === HttpMethod.OPTIONS) {
    send(204)
  }

  const route = async (
    routeMethod: HttpMethod,
    routeVerb: string,
    routeAction: ({ params, data }: { params: string[]; data: object }) => Promise<any>,
    parsedData: object = {},
  ): Promise<any> => {
    if (method === routeMethod && verb === routeVerb) {
      try {
        const result = await routeAction({ params, data: parsedData })

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
        const parsedData = JSON.parse(chunk.toString())
        await route(HttpMethod.POST, 'create', ({ data }) => DB.create(data), parsedData)
        await route(HttpMethod.PUT, 'update', ({ params, data }) => DB.update(params[0], data), parsedData)
      } catch (e) {
        // TODO return 4xx/5xx
        console.warn('request data parse failed', e)
      }
    })
    .on('end', async () => {
      await route(HttpMethod.GET, 'readAll', () => DB.readAll())
      await route(HttpMethod.GET, 'read', ({ params }) => DB.read(params[0]))
      await route(HttpMethod.DELETE, 'delete', ({ params }) => DB.delete(params[0]))
    })
}

Https.createServer(serverOptions, routes).listen(SERVER_PORT)
