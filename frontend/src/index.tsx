import * as React from 'react'
import * as ReactDOM from 'react-dom'

const getApiBaseUrl = (): string => 'https://' + (
  process.env.NODE_ENV === 'development'
  ? 'localhost:8888'
  : 'dat.zeppel.net/wordcards'
) + '/api'

const fetchOptions: RequestInit = {
  mode: 'cors'
}

const q = path => fetch(getApiBaseUrl() + path, fetchOptions).then(r => r.json())

const request = async () => {
  const r = await q('/test')
  console.log(r)
}

const App: React.FC = () => (
  <>
    <h1>hellooooooooooooooo</h1>
    <button onClick={request}>request</button>
  </>
)

ReactDOM.render(<App />, document.getElementById('app'))
