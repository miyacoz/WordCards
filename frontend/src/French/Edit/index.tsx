import React, { useState, useEffect } from 'react'

import {
  Article,
  Id,
  Language,
  TheLemma,
  Tag,
  DeleteButton,
  UpdateButton,
} from './styled'
import { ILemma, IFrenchLemma } from '/typings'
import Word from '/Word'
import Adverb from '/French/Edit/Adverb'
import Interjection from '/French/Edit/Interjection'

interface IProps extends IFrenchLemma {
  handleDelete: (id: string) => () => Promise<void>
  handleUpdate: (data: ILemma) => () => Promise<void>
}

const Lemma: React.FC<IProps> = ({ handleDelete, handleUpdate, ...lemma }) => {
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    setFormData(lemma)

    return () => setFormData(null)
  }, [])

  if (formData) {
    const { _id, lemma: theLemma, words, tags } = formData

    return (
      <Article>
        <DeleteButton onClick={handleDelete(_id)}>Delete Lemma</DeleteButton>
        <Id>ID: {_id}</Id>
        <Language>French</Language>
        <TheLemma>{theLemma}</TheLemma>

        {words.map((word, i) => {
          switch (word.class) {
            case 'adverb':
              return (
                <Adverb key={i} index={i} {...word} setFormData={setFormData} />
              )
            case 'interjection':
              return (
                <Interjection
                  key={i}
                  index={i}
                  {...word}
                  setFormData={setFormData}
                />
              )
            default:
              return (
                <Word key={i} index={i} {...word} setFormData={setFormData} />
              )
          }
        })}

        {tags.map(tag => (
          <Tag>{tag}</Tag>
        ))}

        <UpdateButton onClick={handleUpdate(formData)}>Update</UpdateButton>
      </Article>
    )
  } else {
    return <div>Preparing...</div>
  }
}

export default {
  Adverb,
  Interjection,
  Word,
  Lemma,
}
