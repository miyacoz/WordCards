import * as React from 'react'
import S from 'styled-components'

import { IWord } from '../typings'
import Word from '../Word'

type TFrenchAdverb = IWord & { class: 'adverb' }

const AdverbBox = S.div`
  background-color: #ccf;
`
const Adverb: React.FC = (props: TFrenchAdverb) => (
  <AdverbBox>
    <Word {...props} />
  </AdverbBox>
)

export default Adverb
