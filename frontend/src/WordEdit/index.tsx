import React, { useState, useEffect } from 'react'

import { TextField } from './styled'
import { IWord } from '/typings'
import { capitalise } from '/helpers'

const classes = ['adverb', 'interjection']

type TextFieldKey = 'class' | 'meanings' | 'examples' | 'memo'

interface IProps extends IWord {
  index: number
  setFormData: Function
}

const handleChange = (key: TextFieldKey, { index, setFormData }: Pick<IProps, 'index' | 'setFormData'>) => (
  event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>,
): void => {
  const t = event.target

  setFormData(lemma => {
    lemma.words[index][key] = t.value
    return lemma
  })
}

const WordEdit: React.FC<IProps> = ({
  setFormData,
  index,
  ...word
}) => (
  <dl>
    <dt>Class</dt>
    <dd>
      <select value={word.class} onChange={handleChange('class', { index, setFormData })}>
        {classes.map(classe => (
          <option key={classe} value={classe}>
            {capitalise(classe)}
          </option>
        ))}
      </select>
    </dd>

    <dt>Meanings</dt>
    <dd>
      <TextField
        onChange={handleChange('meanings', { index, setFormData })}
        defaultValue={word.meanings}
      />
    </dd>

    <dt>Examples</dt>
    <dd>
      <TextField
        onChange={handleChange('examples', { index, setFormData })}
        defaultValue={word.examples}
      />
    </dd>

    <dt>Memo</dt>
    <dd>
      <TextField onChange={handleChange('memo', { index, setFormData })} defaultValue={word.memo} />
    </dd>
  </dl>
)

export default WordEdit
