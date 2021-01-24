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
}

export interface IState {
  isTransfering: boolean
  isFiltering: boolean
  lemmata: ILemma[]
  filteredLemmata: ILemma[]
  filteringQuery: string
  currentLemmaDetail: ILemma | null
  currentLemmaEdit: ILemma | null
}

export interface IAction {
  type: ACTIONS
  payload?: any
}

export const initialState: IState = {
  isTransfering: false,
  isFiltering: false,
  lemmata: [],
  filteredLemmata: [],
  filteringQuery: '',
  currentLemmaDetail: null,
  currentLemmaEdit: null,
}

const isString = (x: IAction['payload']): x is string => `${x}` === x
const isLemma = (x: IAction['payload']): x is ILemma =>
  'lemma' in x && !('length' in x)
const isLemmata = (x: IAction['payload']): x is ILemma[] =>
  !('lemma' in x) && 'length' in x

// TODO search all text
const filterLemmata = (lemmata: ILemma[], query: string) =>
  lemmata.filter(({ lemma }) => new RegExp(query, 'gi').test(lemma))

export const reducer = (state: IState, action: IAction): IState => {
  const { type, payload } = action

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
      }
    default:
      if (isString(payload)) {
        if (type === ACTIONS.FILTERING) {
          return {
            ...state,
            isFiltering: true,
            filteredLemmata: filterLemmata(state.lemmata, payload),
            filteringQuery: payload,
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
            filteredLemmata: filterLemmata(payload, state.filteringQuery),
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
