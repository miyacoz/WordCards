import React, { useReducer, Dispatch } from 'react'
import * as ReactDOM from 'react-dom'

import { Main } from './styled'
import { ILemma } from '/typings'
import {
  handleCreate,
  handleClickLemma,
  handleSearch,
  handleSearchKeyUp,
  handleSearchKeyDown,
  handleEdit,
  handleDelete,
  handleUpdate,
  transfering,
} from './logic'
import { initialState, reducer, ACTIONS, IAction } from './reducer'
import HttpRequest from '/HttpRequest'
import DetailView from '/DetailView'
import EditView from '/EditView'
import ListView from '/ListView'

const App: React.FC = () => {
  const [
    {
      isTransfering,
      isFiltering,
      lemmata,
      filteredLemmata,
      currentLemmaDetail,
      currentLemmaEdit,
      searchCursorAt,
    },
    dispatch,
  ] = useReducer(reducer, initialState)

  React.useEffect(() => {
    const readAll = async () =>
      transfering(dispatch)(async () => {
        const r = (await new HttpRequest().read('/readAll')) as ILemma[]
        dispatch({ type: ACTIONS.SET_LEMMATA, payload: r })
      })

    readAll()
  }, [])

  return (
    <>
      <h1>Wordcards</h1>
      <button
        disabled={isTransfering}
        onClick={handleCreate(transfering)(dispatch)}
      >
        create a new french word "vraiment"
      </button>

      <Main>
        <ListView
          handleSearch={handleSearch(lemmata, dispatch)}
          handleSearchKeyUp={handleSearchKeyUp(
            { lemmata, filteredLemmata, isFiltering, searchCursorAt },
            dispatch,
          )}
          handleSearchKeyDown={handleSearchKeyDown(dispatch)}
          handleClickLemma={handleClickLemma(lemmata, dispatch)}
          data={isFiltering ? filteredLemmata : lemmata}
          isTransfering={isTransfering}
          searchCursorAt={searchCursorAt}
        />

        <DetailView
          lemma={currentLemmaDetail}
          handleEdit={handleEdit(lemmata, dispatch)}
        />

        <EditView
          lemma={currentLemmaEdit}
          handleDelete={handleDelete(transfering)(lemmata, dispatch)}
          handleUpdate={handleUpdate(transfering)(dispatch)}
        />
      </Main>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
