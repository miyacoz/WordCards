import * as React from 'react'
import * as ReactDOM from 'react-dom'

const isDevelopment = process.env.NODE_ENV === 'development'

const getApiBaseUrl = (): string => 'https://' + (
  isDevelopment
  ? 'localhost:8888'
  : 'dat.zeppel.net/wordcards'
) + '/api'

const fetchOptions: RequestInit = {
  mode: isDevelopment ? 'cors' : 'same-origin'
}

enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class HttpRequest {
  private q = (method: HttpMethod, path: string, data: object = {}): object | null =>
    fetch(
      getApiBaseUrl() + path,
      {
        ...fetchOptions,
        method,
        ...data
      }
    )
      .then(r =>
        {
          try {
            console.log(r)
            return r.json()
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

const request = async () => {
  const r = await new HttpRequest().read('/test')
  console.log(r)
}

const App: React.FC = () => (
  <>
    <h1>hellooooooooooooooo</h1>
    <button onClick={request}>request</button>
  </>
)

ReactDOM.render(<App />, document.getElementById('app'))
