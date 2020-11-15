import * as React from 'react'
import S from 'styled-components'

import { IWord, ILemma } from '/typings'
import Word from '/Word'
import Adverb, { TFrenchAdverb } from '/French/Adverb'
import Interjection, { TFrenchInterjection } from '/French/Interjection'

type TFrenchWord = TFrenchAdverb | TFrenchInterjection

type TFrenchLemma = ILemma<TFrenchAdverb | TFrenchInterjection>

const Article = S.div`
  margin-bottom: 2rem;
  border-bottom: solid 1px #ccc;
  padding: 1rem;
`

const LemmaLanguage = S.div`
  font-style: oblique;
`

const LemmaWrapper = S.div`
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 2rem;
`

const LemmaTag = S.a`
  margin-right: 1rem;
`

const DeleteButton = S.a`
  display: inline-block;
  border: solid 1px red;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  color: red;
`

const Lemma: React.FC = (props: TFrenchLemma & { remove: (id: string) => Promise<void> }) => (
  <Article>
    <LemmaLanguage>French</LemmaLanguage>
    <LemmaWrapper>{props.lemma}</LemmaWrapper>

    {props.words.map((word, i) => {
      switch (word.class) {
        case 'adverb': return <Adverb key={i} {...word} />
        case 'interjection': return <Interjection key={i} {...word} />
        default: return <Word key={i} {...word} />
      }
    })}

    {props.tags.map(tag => <LemmaTag>{tag}</LemmaTag>)}

    <DeleteButton onClick={props.remove(props._id)}>Delete Lemma</DeleteButton>
  </Article>
)

export default {
  Adverb,
  Interjection,
  Word,
  Lemma,
}
