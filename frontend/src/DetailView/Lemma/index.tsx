import React from 'react'

import { ILemma, IFrenchLemma } from '/typings'
import French from '/French'

interface IProps {
  lemma: ILemma
  handleEdit: (id: string) => () => void
}

const isFrenchLemma = (lemma: ILemma): lemma is IFrenchLemma =>
  lemma.lang === 'fr'

const Lemma: React.FC<IProps> = ({ lemma, handleEdit }) => {
  if (isFrenchLemma(lemma)) {
    return <French.Lemma {...lemma} handleEdit={handleEdit} />
  }

  return <div>something went wrong</div>
}

export default Lemma
