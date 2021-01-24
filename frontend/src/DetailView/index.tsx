import React from 'react'

import { Wrapper } from './styled'
import { ILemma } from '/typings'
import Lemma from './Lemma'

interface IProps {
  lemma: ILemma | null
  handleEdit: (id: string) => () => void
}

const DetailView: React.FC<IProps> = ({ lemma, handleEdit }) => (
  <Wrapper>
    {lemma ? (
      <Lemma key={lemma._id} lemma={lemma} handleEdit={handleEdit} />
    ) : (
      <div>&lt;--- select a lemma!</div>
    )}
  </Wrapper>
)

export default DetailView
