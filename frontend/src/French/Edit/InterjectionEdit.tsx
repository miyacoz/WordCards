import * as React from 'react'
import styled from 'styled-components'

import { IWord } from '/typings'
import WordEdit from '/WordEdit'

export type TFrenchInterjectionEdit = IWord & {
  class: 'adverb'
  setFormData: Function
  index: number
}

const InterjectionEditBox = styled.div`
  background-color: #ffc;
`
const InterjectionEdit: React.FC<TFrenchInterjectionEdit> = props => (
  <InterjectionEditBox>
    <WordEdit {...props} />
  </InterjectionEditBox>
)

export default InterjectionEdit
