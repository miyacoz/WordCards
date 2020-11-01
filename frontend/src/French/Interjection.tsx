import * as React from 'react'
import S from 'styled-components'

import { IWord } from '../typings'
import Word from '../Word'

type TFrenchInterjection = IWord & { class: 'interjection' }

const InterjectionBox = S.div`
  background-color: #ffc;
`
const Interjection: React.FC = (props: TFrenchInterjection) => (
  <InterjectionBox>
    <Word {...props} />
  </InterjectionBox>
)

export default Interjection
