import * as React from 'react'
import S from 'styled-components'

import { IWord } from '../typings'
import Word from '../Word'

export type TFrenchInterjection = IWord & { class: 'interjection' }

const InterjectionBox = S.div`
  background-color: #ffc;
`
const Interjection: React.FC<TFrenchInterjection> = props => (
  <InterjectionBox>
    <Word {...props} />
  </InterjectionBox>
)

export default Interjection
