import * as React from 'react'
import * as ReactDOM from 'react-dom'

const isDevelopment = process.env.NODE_ENV === 'development'

const getApiBaseUrl = (): string => 'https://' + (
  isDevelopment
  ? 'localhost:8888'
  : 'dat.zeppel.net/wordcards'
) + '/api'

const fetchOptions: RequestInit = {
  mode: isDevelopment ? 'cors' : 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
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
        body: JSON.stringify(data),
      }
    )
      .then(r =>
        {
          try {
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

const App: React.FC = () => {
  const [data, setData] = React.useState('')

  const request = async () => {
    const r = await new HttpRequest().create('/create', {
      lang: 'fr',
      lemma: 'vraiment',
      words: [
        {
          class: 'adverb',
          meanings: '1. trully, really, genuinely\n1. really, very',
          examples: '1. Elle est vraiment belle.\n  - She is really beautiful.',
          memo: '',
        },
        {
          class: 'interjection',
          meanings: '1. really? for real?',
          examples: '',
          memo: '',
        },
      ],
      tags: [],
    })

    setData(r)
  }

  return (
    <>
      <h1>hellooooooooooooooo</h1>
      <button onClick={request}>request</button>
      <div>{JSON.stringify(data)}</div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
