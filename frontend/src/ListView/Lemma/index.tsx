import * as React from 'react'

import { Wrapper, Title, Lang } from './styled'
import { ILemma } from '/typings'
import { capitalise } from '/helpers'

interface IProps {
  lemma: ILemma
  onClick: (id: string) => void
  active: boolean
}

const Lemma: React.FC<IProps> = ({ lemma, onClick, active }) => (
  <Wrapper onClick={onClick(lemma._id)} active={active}>
    <Title>{lemma.lemma}</Title>
    <Lang>{capitalise(lemma.lang)}</Lang>
  </Wrapper>
)

export default Lemma
