import React from 'react'

import { List, Message, SearchTips, Wrapper } from './styled'
import { ILemma } from '/typings'
import Lemma from './Lemma'
import Search from './Search'

interface IProps {
  handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSearchKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleSearchKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void
  handleClickLemma: (id: string) => void
  data: ILemma[]
  isTransfering: boolean
  searchCursorAt: number
}

const ListView: React.FC<IProps> = ({
  handleSearch,
  handleSearchKeyUp,
  handleSearchKeyDown,
  handleClickLemma,
  data,
  isTransfering,
  searchCursorAt,
}) => (
  <Wrapper>
    <Search
      onChange={handleSearch}
      onKeyUp={handleSearchKeyUp}
      onKeyDown={handleSearchKeyDown}
    />
    <SearchTips>
      you can navigate your cursor by pressing "arrow up" and "arrow down" keys,
      and use "enter" key to show the word detail
    </SearchTips>

    <List>
      {data.length ? (
        <>
          {data.map((lemma, i) => (
            <Lemma
              key={lemma._id}
              lemma={lemma}
              onClick={handleClickLemma}
              active={searchCursorAt === i}
            />
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
