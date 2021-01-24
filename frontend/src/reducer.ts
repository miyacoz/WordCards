import { ILemma } from '/typings'

export enum ACTIONS {
  TRANSFERING = 'TRANSFERING',
  NOT_TRANSFERING = 'NOT_TRANSFERING',
  FILTERING = 'FILTERING',
  NOT_FILTERING = 'NOT_FILTERING',
  SET_LEMMATA = 'SET_LEMMATA',
  SET_FILTERED_LEMMATA = 'SET_FILTERED_LEMMATA',
  SET_CURRENT_LEMMA_DETAIL = 'SET_CURRENT_LEMMA_DETAIL',
  SET_CURRENT_LEMMA_EDIT = 'SET_CURRENT_LEMMA_EDIT',
  LEMMA_DELETED = 'LEMMA_DELETED',
  SEARCH_CURSOR_MOVED_UP = 'SEARCH_CURSOR_MOVED_UP',
  SEARCH_CURSOR_MOVED_DOWN = 'SEARCH_CURSOR_MOVED_DOWN',
}

export interface IAction {
  type: ACTIONS
  payload?: any
}

export interface IState {
  isTransfering: boolean
  isFiltering: boolean
  lemmata: ILemma[]
  filteredLemmata: ILemma[]
  filteringQuery: string
  currentLemmaDetail: ILemma | null
  currentLemmaEdit: ILemma | null
  searchCursorAt: number
}

export const initialState: IState = {
  isTransfering: false,
  isFiltering: false,
  lemmata: [],
  filteredLemmata: [],
  filteringQuery: '',
  currentLemmaDetail: null,
  currentLemmaEdit: null,
  searchCursorAt: 0,
}

const isString = (x: IAction['payload']): x is string => `${x}` === x
const isLemma = (x: IAction['payload']): x is ILemma =>
  'lemma' in x && !('length' in x)
const isLemmata = (x: IAction['payload']): x is ILemma[] =>
  !('lemma' in x) && 'length' in x

// TODO search all text
const filterLemmata = (lemmata: ILemma[], query: string) =>
  lemmata.filter(({ lemma }) => new RegExp(query, 'gi').test(lemma))

const calculateNewSearchCursorAt = (state: IState, delta: number): number => {
  const { searchCursorAt, isFiltering, lemmata, filteredLemmata } = state
  let newSearchCursorAt = searchCursorAt + delta
  const l = isFiltering ? filteredLemmata : lemmata

  if (newSearchCursorAt < 0) {
    return l.length - 1
  } else if (newSearchCursorAt >= l.length) {
    return 0
  }

  return newSearchCursorAt
}

export const reducer = (state: IState, action: IAction): IState => {
  const { type, payload } = action
  const {
    isFiltering,
    lemmata,
    filteredLemmata,
    filteringQuery,
    searchCursorAt,
  } = state

  switch (type) {
    case ACTIONS.TRANSFERING:
      return { ...state, isTransfering: true }
    case ACTIONS.NOT_TRANSFERING:
      return { ...state, isTransfering: false }
    case ACTIONS.NOT_FILTERING:
      return {
        ...state,
        isFiltering: false,
        filteredLemmata: [],
        filteringQuery: '',
        searchCursorAt: 0,
      }
    case ACTIONS.SEARCH_CURSOR_MOVED_UP:
      return { ...state, searchCursorAt: calculateNewSearchCursorAt(state, -1) }
    case ACTIONS.SEARCH_CURSOR_MOVED_DOWN:
      return { ...state, searchCursorAt: calculateNewSearchCursorAt(state, 1) }
    default:
      if (isString(payload)) {
        if (type === ACTIONS.FILTERING) {
          return {
            ...state,
            isFiltering: true,
            filteredLemmata: filterLemmata(lemmata, payload),
            filteringQuery: payload,
            searchCursorAt: 0,
          }
        }
      } else if (isLemmata(payload)) {
        if (type === ACTIONS.SET_LEMMATA) {
          return { ...state, lemmata: payload }
        } else if (type === ACTIONS.SET_FILTERED_LEMMATA) {
          return { ...state, filteredLemmata: payload }
        } else if (type === ACTIONS.LEMMA_DELETED) {
          return {
            ...state,
            lemmata: payload,
            filteredLemmata: filterLemmata(payload, filteringQuery),
            currentLemmaDetail: null,
            currentLemmaEdit: null,
          }
        }
      } else if (isLemma(payload)) {
        if (type === ACTIONS.SET_CURRENT_LEMMA_DETAIL) {
          return { ...state, currentLemmaDetail: payload }
        } else if (type === ACTIONS.SET_CURRENT_LEMMA_EDIT) {
          return { ...state, currentLemmaEdit: payload }
        }
      }

      throw new Error(
        `unknown action type: ${type}, payload: ${JSON.stringify(payload)}`,
      )
  }
}
