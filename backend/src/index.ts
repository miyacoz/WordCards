import * as Fs from 'fs'
import * as Http from 'http'
import * as Https from 'https'

import Config from './Config'
import HttpMethod from './HttpMethod'
import Routes from './Routes'

const serverOptions: Https.ServerOptions = {
  key: Fs.readFileSync(Config.SSL_KEY || ''),
  cert: Fs.readFileSync(Config.SSL_CERT || ''),
}

const SERVER_PORT: number = Number(Config.SERVER_PORT) || 0
const API_PREFIX: string = 'api'

const headers: Http.OutgoingHttpHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const empty = Buffer.alloc(0)

const requestHandler: Http.RequestListener = (
  q: Http.IncomingMessage,
  r: Http.ServerResponse,
): void => {
  const send = (code: number, data?: object): void => {
    const isDataEmpty = typeof data === 'undefined'
    r.writeHead(code, headers)
    r.write(isDataEmpty ? empty : JSON.stringify(data))
    r.end()
  }

  const pathAndParams = q.url?.split('?')
  const paths = (pathAndParams || [])[0]
    .split('/')
    .filter(v => v && v !== API_PREFIX)
  const verb = paths.shift()
  const params = paths
  const method = q.method?.toLowerCase()

  if (!method) {
    return
  }

  const route = async (
    routeMethod: HttpMethod,
    routeVerb: string,
    routeAction: ({
      params,
      data,
    }: {
      params: string[]
      data: object
    }) => Promise<any>,
    parsedData: object = {},
  ): Promise<any> => {
    if (method === routeMethod && verb === routeVerb) {
      try {
        const result = await routeAction({ params, data: parsedData })

        const code =
          typeof result === 'undefined'
            ? 204
            : routeMethod === HttpMethod.PUT
            ? 201
            : 200

        send(code, result)
      } catch (e) {
        console.warn('data process failed', e)
        // TODO return error 4xx/5xx
        send(500)
      }
    }
  }

  const chunks: Array<string | Buffer | null> = []

  q.on('data', chunk => chunks.push(chunk)).on('end', () => {
    if ([String(HttpMethod.GET), String(HttpMethod.DELETE)].includes(method)) {
      try {
        Routes(route)
      } catch (e) {
        // TODO return 4xx/5xx
        console.warn('process failed', e)
      }
    } else if (
      [String(HttpMethod.POST), String(HttpMethod.PUT)].includes(method)
    ) {
      try {
        const data = JSON.parse(chunks.join(''))

        try {
          Routes(route, data)
        } catch (e) {
          // TODO return 4xx/5xx
          console.warn('process failed', e)
        }
      } catch (e) {
        // TODO return 4xx/5xx
        console.warn('request data parse failed', e)
      }
    } else {
      send(204)
    }
  })
}

Https.createServer(serverOptions, requestHandler).listen(SERVER_PORT)
