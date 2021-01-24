import React from 'react'

import { List, Message, Wrapper } from './styled'
import { ILemma } from '/typings'
import Lemma from './Lemma'
import Search from './Search'

interface IProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchEnter: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleClickLemma: (id: string) => void
  data: ILemma[]
  isTransfering: boolean
}

const ListView: React.FC<IProps> = ({
  handleSearch,
  handleSearchEnter,
  handleClickLemma,
  data,
  isTransfering,
}) => (
  <Wrapper>
    <Search onChange={handleSearch} onKeyUp={handleSearchEnter} />

    <List>
      {data.length ? (
        <>
          {data.map(lemma => (
            <Lemma key={lemma._id} lemma={lemma} onClick={handleClickLemma} />
          ))}
        </>
      ) : isTransfering ? (
        <Message>Loading...</Message>
      ) : (
        <Message>No data!</Message>
      )}
    </List>
  </Wrapper>
)

export default ListView
