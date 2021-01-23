import * as React from 'react'
import styled from 'styled-components'

import { IWord } from '/typings'
import WordEdit from '/WordEdit'

export type TFrenchAdverbEdit = IWord & {
  class: 'adverb'
  setFormData: Function
  index: number
}

const AdverbEditBox = styled.div`
  background-color: #ccf;
`
const AdverbEdit: React.FC<TFrenchAdverbEdit> = props => (
  <AdverbEditBox>
    <WordEdit {...props} />
  </AdverbEditBox>
)

export default AdverbEdit
