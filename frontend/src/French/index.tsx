import * as React from 'react'

import { Article, Id, Language, TheLemma, Tag, EditButton } from './styled'
import { IFrenchLemma } from '/typings'
import Word from '/Word'
import Adverb from '/French/Adverb'
import Interjection from '/French/Interjection'

interface IProps extends IFrenchLemma {
  handleEdit: (id: string) => () => void
}

const Lemma: React.FC<IProps> = ({ lemma, words, tags, _id, handleEdit }) => (
  <Article>
    <Id>ID: {_id}</Id>
    <Language>French</Language>
    <TheLemma>{lemma}</TheLemma>

    {words.map((word, i) => {
      switch (word.class) {
        case 'adverb':
          return <Adverb key={i} {...word} />
        case 'interjection':
          return <Interjection key={i} {...word} />
        default:
          return <Word key={i} {...word} />
      }
    })}

    {tags.map(tag => (
      <Tag>{tag}</Tag>
    ))}

    <EditButton onClick={handleEdit(_id)}>Edit</EditButton>
  </Article>
)

export default {
  Adverb,
  Interjection,
  Word,
  Lemma,
}
