import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { IWord } from '/typings'
import { capitalise } from '/helpers'

const classes = [
  'adverb',
  'interjection',
]

const TextField = styled.textarea`
  width: 90%;
  min-height: 10rem;
`

type TextFieldKey = 'class' | 'meanings' | 'examples' | 'memo'

interface IWordEditProps extends IWord {
  index: number
  setFormData: Function
}

const WordEdit: React.FC<IWordEditProps> = ({ setFormData, index, ...word }) => {
  const handleChange = (key: TextFieldKey) => (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>): void => {
    const t = event.target
    setFormData(lemma => {
      lemma.words[index][key] = t.value
      return lemma
    })
  }

  return (
    <dl>
      <dt>Class</dt>
      <dd>
        <select value={word.class} onChange={handleChange('class')}>
          {classes.map(classe => <option key={classe} value={classe}>{capitalise(classe)}</option>)}
        </select>
      </dd>

      <dt>Meanings</dt>
      <dd>
        <TextField onChange={handleChange('meanings')} defaultValue={word.meanings} />
      </dd>

      <dt>Examples</dt>
      <dd>
        <TextField onChange={handleChange('examples')} defaultValue={word.examples} />
      </dd>

      <dt>Memo</dt>
      <dd>
        <TextField onChange={handleChange('memo')} defaultValue={word.memo} />
      </dd>
    </dl>
  )
}

export default WordEdit
