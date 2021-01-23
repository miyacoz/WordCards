import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { IWord, ILemma } from '/typings'
import Word from '/Word'
import AdverbEdit, { TFrenchAdverbEdit } from '/French/Edit/AdverbEdit'
import InterjectionEdit, { TFrenchInterjectionEdit } from '/French/Edit/InterjectionEdit'

type TFrenchWord = TFrenchAdverbEdit | TFrenchInterjectionEdit

type TFrenchLemma = ILemma<TFrenchAdverbEdit | TFrenchInterjectionEdit>

const Article = styled.div`
  margin-bottom: 2rem;
  border-bottom: solid 1px #ccc;
  padding: 1rem;
`

const LemmaLanguage = styled.div`
  font-style: oblique;
`

const LemmaWrapper = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  line-height: 2rem;
`

const LemmaTag = styled.a`
  margin-right: 1rem;
`

const DeleteButton = styled.a`
  display: inline-block;
  border: solid 1px red;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  color: red;
`

const SaveButton = styled.a`
  display: inline-block;
  border: solid 1px blue;
  border-radius: 5px;
  padding: 0.2rem 0.5rem;
  color: blue;
`

interface ILemmaProps extends TFrenchLemma {
  remove: (id: string) => Promise<void>
  save: (data: ILemma) => Promise<void>
}

const Lemma: React.FC<ILemmaProps> = ({
  remove,
  save,
  ...lemma
}) => {
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    setFormData(lemma)

    return () => setFormData(null)
  }, [])

  if (formData) {
    const {
      _id,
      lemma: name,
      words,
      tags,
    } = formData

    return (
      <Article>
        <DeleteButton onClick={remove(_id)}>Delete Lemma</DeleteButton>
        <LemmaLanguage>French</LemmaLanguage>
        <LemmaWrapper>{name}</LemmaWrapper>

        {words.map((word, i) => {
          switch (word.class) {
            case 'adverb': return <AdverbEdit key={i} index={i} {...word} setFormData={setFormData} />
            case 'interjection': return <InterjectionEdit key={i} index={i} {...word} setFormData={setFormData} />
            default: return <Word key={i} index={i} {...word} setFormData={setFormData} />
          }
        })}

        {tags.map(tag => <LemmaTag>{tag}</LemmaTag>)}

        <SaveButton onClick={save(formData)}>Save</SaveButton>
      </Article>
    )
  } else {
    return <div>Preparing...</div>
  }
}

export default {
  AdverbEdit,
  InterjectionEdit,
  Word,
  Lemma,
}
