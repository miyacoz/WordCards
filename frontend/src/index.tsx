import * as React from 'react'
import * as ReactDOM from 'react-dom'

import French from './French'

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

const App: React.FC = () => {
  const [isTransfering, setIsTransfering] = React.useState(false)
  const [data, setData] = React.useState([])

  React.useEffect(() => {
    const readAll = async () => {
      setIsTransfering(true)

      const r = await new HttpRequest().read('/readAll')

      setIsTransfering(false)
      setData(r)
    }

    readAll()
  }, [])

  const create = async () => {
    setIsTransfering(true)

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

    setIsTransfering(false)
    setData(prevData => [...prevData, r])
  }

  const remove = (id: string) => async () => {
    setIsTransfering(true)

    const r = await new HttpRequest().delete(`/delete/${id}`)

    setIsTransfering(false)
    r && setData(prevData => prevData.filter(lemma => lemma._id !== id))
  }

  return (
    <>
      <h1>hellooooooooooooooo</h1>
      <button disabled={isTransfering} onClick={create}>create</button>
      {data.length ? (
        <>
          {data.map(lemma => <French.Lemma key={lemma._id} {...lemma} remove={remove} />)}
        </>
      ) : isTransfering ? (
        <div>Loading...</div>
      ) : (
        <div>No data!</div>
      )}
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
