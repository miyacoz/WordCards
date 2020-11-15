import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled from 'styled-components'

import { capitalise } from './helpers'
import HttpRequest from './HttpRequest'
import { ILemma } from './typings'
import French from './French'

const Main = styled.div`
  display: flex;
`

const LemmaList = styled.div`
  flex-grow: 1;
`

const LemmaLinkWrapper = styled.a`
  display: block;
  padding: 0.3rem;
  border-bottom: solid 1px lightgrey;
  cursor: pointer;
  &:hover {
    background: #eee;
  }
`

const LemmaLinkTitle = styled.span`
  font-size: 1.5rem;
  line-height: 2rem;
`

const LemmaLinkLang = styled.span`
  padding: 0 0.5rem;
  font-size: 1rem;
  font-style: oblique;
  color: grey;
`

interface ILemmaProps {
  lemma: ILemma
  onClick: Function
}

const Lemma: React.FC<ILemmaProps> = ({ lemma, onClick }) => (
  <LemmaLinkWrapper onClick={onClick(lemma._id)}>
    <LemmaLinkTitle>{lemma.lemma}</LemmaLinkTitle>
    <LemmaLinkLang>{capitalise(lemma.lang)}</LemmaLinkLang>
  </LemmaLinkWrapper>
)

const LemmaView = styled.div`
  flex-grow: 2
`

const LemmaEdit = styled.div`
  flex-grow: 2
`

const App: React.FC = () => {
  const [isTransfering, setIsTransfering] = React.useState(false)
  const [data, setData] = React.useState([])
  const [currentLemmaView, setCurrentLemmaView] = React.useState(null)
  const [currentLemmaEdit, setCurrentLemmaEdit] = React.useState(null)

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
    setCurrentLemmaView(null)
  }

  const handleClickLemma = (id: string) => () => {
    const foundLemma = data.find(lemma => lemma._id === id)
    if (foundLemma) {
      setCurrentLemmaView(foundLemma)
    } else {
      // TODO display error
      console.warn(`lemma at id:${id} not found`)
    }
  }

  return (
    <>
      <h1>Wordcards</h1>
      <button disabled={isTransfering} onClick={create}>create a new french word "vraiment"</button>

      <Main>
        <LemmaList>
          {data.length ? (
            <>
              {data.map(lemma => <Lemma key={lemma._id} lemma={lemma} onClick={handleClickLemma} />)}
            </>
          ) : isTransfering ? (
            <div>Loading...</div>
          ) : (
            <div>No data!</div>
          )}
        </LemmaList>

        <LemmaView>
          {currentLemmaView ? (
            <French.Lemma key={currentLemmaView._id} {...currentLemmaView} remove={remove} />
          ) : (
            <div>&lt;--- select a lemma!</div>
          )}
        </LemmaView>

        <LemmaEdit>
          {currentLemmaEdit ? (
            <French.Lemma key={currentLemmaEdit._id} {...currentLemmaEdit} remove={remove} />
          ) : (
            <div>Waiting for edit</div>
          )}
        </LemmaEdit>
      </Main>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
