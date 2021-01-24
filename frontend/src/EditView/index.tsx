import React from 'react'

import { Wrapper } from './styled'
import { ILemma } from '/typings'
import Lemma from './Lemma'

interface IProps {
  lemma: ILemma | null
  handleDelete: (id: string) => () => Promise<void>
  handleUpdate: (lemma: ILemma) => () => Promise<void>
}

const EditView: React.FC<IProps> = ({ lemma, handleDelete, handleUpdate }) => (
  <Wrapper>
    {lemma ? (
      <Lemma
        key={lemma._id}
        lemma={lemma}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    ) : (
      <div>Waiting for edit</div>
    )}
  </Wrapper>
)

export default EditView
