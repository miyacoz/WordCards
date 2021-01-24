import React, { useReducer, Dispatch } from 'react'
import * as ReactDOM from 'react-dom'

import { Main } from './styled'
import { ILemma } from '/typings'
import {
  initialState,
  handleCreate,
  handleClickLemma,
  handleSearch,
  handleSearchEnter,
  handleEdit,
  handleDelete,
  handleUpdate,
  reducer,
  transfering,
  ACTIONS,
  IAction,
} from './logic'
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
          handleSearchEnter={handleSearchEnter(
            { lemmata, filteredLemmata, isFiltering },
            dispatch,
          )}
          handleClickLemma={handleClickLemma(lemmata, dispatch)}
          data={isFiltering ? filteredLemmata : lemmata}
          isTransfering={isTransfering}
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
