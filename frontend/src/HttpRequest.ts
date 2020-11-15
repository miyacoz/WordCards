const isDevelopment = process.env.NODE_ENV === 'development'

const fetchOptions: RequestInit = {
  mode: isDevelopment ? 'cors' : 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
}

const getApiBaseUrl = (): string => 'https://' + (
  isDevelopment
  ? 'localhost:8888'
  : 'dat.zeppel.net/wordcards'
) + '/api'

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export default class HttpRequest {
  private q = (method: HttpMethod, path: string, data: object = {}): Promise<object | boolean | null> =>
    fetch(
      getApiBaseUrl() + path,
      {
        ...fetchOptions,
        method,
        ...([HttpMethod.POST, HttpMethod.PUT].includes(method) ? {
          body: JSON.stringify(data),
        } : {})
      }
    )
      .then(r =>
        {
          try {
            return [200, 201].includes(r.status) ? r.json() : true
          } catch (_) {
            return null
          }
        }
      )

  public read = (path: string, data: object = {}) => this.q(HttpMethod.GET, path, data)

  public create = (path: string, data: object) => this.q(HttpMethod.POST, path, data)

  public update = (path: string, data: object) => this.q(HttpMethod.PUT, path, data)

  public delete = (path: string) => this.q(HttpMethod.DELETE, path)
}
