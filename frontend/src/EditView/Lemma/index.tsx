import React from 'react'

import { ILemma, IFrenchLemma } from '/typings'
import FrenchEdit from '/French/Edit'

interface IProps {
  lemma: ILemma
  handleDelete: (id: string) => () => Promise<void>
  handleUpdate: (lemma: ILemma) => () => Promise<void>
}

const isFrenchLemma = (lemma: ILemma): lemma is IFrenchLemma =>
  lemma.lang === 'fr'

const Lemma: React.FC<IProps> = ({ lemma, handleDelete, handleUpdate }) => {
  if (isFrenchLemma(lemma)) {
    return (
      <FrenchEdit.Lemma
        {...lemma}
        handleDelete={handleDelete}
        handleUpdate={handleUpdate}
      />
    )
  }

  return <div>something went wrong</div>
}

export default Lemma
