import * as React from 'react'

import { Wrapper, Title, Lang } from './styled'
import { ILemma } from '/typings'
import { capitalise } from '/helpers'

interface IProps {
  lemma: ILemma
  onClick: (id: string) => void
}

const Lemma: React.FC<IProps> = ({ lemma, onClick }) => (
  <Wrapper onClick={onClick(lemma._id)}>
    <Title>{lemma.lemma}</Title>
    <Lang>{capitalise(lemma.lang)}</Lang>
  </Wrapper>
)

export default Lemma
