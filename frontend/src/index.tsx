import * as React from 'react'
import * as ReactDOM from 'react-dom'

import HttpRequest from './HttpRequest'
import French from './French'

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
      <h1>Wordcards</h1>
      <button disabled={isTransfering} onClick={create}>create a new french word "vraiment"</button>
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
