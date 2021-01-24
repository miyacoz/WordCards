import { useReducer, Dispatch } from 'react'

import { ILemma } from '/typings'
import HttpRequest from '/HttpRequest'

export enum ACTIONS {
  TRANSFERING = 'TRANSFERING',
  NOT_TRANSFERING = 'NOT_TRANSFERING',
  FILTERING = 'FILTERING',
  NOT_FILTERING = 'NOT_FILTERING',
  SET_LEMMATA = 'SET_LEMMATA',
  SET_FILTERED_LEMMATA = 'SET_FILTERED_LEMMATA',
  SET_CURRENT_LEMMA_DETAIL = 'SET_CURRENT_LEMMA_DETAIL',
  SET_CURRENT_LEMMA_EDIT = 'SET_CURRENT_LEMMA_EDIT',
}

interface IState {
  isTransfering: boolean
  isFiltering: boolean
  lemmata: ILemma[]
  filteredLemmata: ILemma[]
  currentLemmaDetail: ILemma | null
  currentLemmaEdit: ILemma | null
}

export interface IAction {
  type: ACTIONS
  payload?: ILemma | ILemma[]
}

export const initialState: IState = {
  isTransfering: false,
  isFiltering: false,
  lemmata: [],
  filteredLemmata: [],
  currentLemmaDetail: null,
  currentLemmaEdit: null,
}

const exampleLemma = {
  lang: 'fr',
  lemma: 'vraiment',
  words: [
    {
      class: 'adverb',
      meanings: '1. trully, really, genuinely\n1. really, very',
      examples: '1. Elle est vraiment belle.\n  - She is really beautiful.',
      memo: '',
    },
    {
      class: 'interjection',
      meanings: '1. really? for real?',
      examples: '',
      memo: '',
    },
  ],
  tags: [],
}

const isLemma = (x: ILemma | ILemma[]): x is ILemma =>
  'lemma' in x && !('length' in x)
const isLemmata = (x: ILemma | ILemma[]): x is ILemma[] =>
  !('lemma' in x) && 'length' in x

export const reducer = (state: IState, action: IAction): IState => {
  const { type, payload } = action

  switch (type) {
    case ACTIONS.TRANSFERING:
      return { ...state, isTransfering: true }
    case ACTIONS.NOT_TRANSFERING:
      return { ...state, isTransfering: false }
    case ACTIONS.FILTERING:
      return { ...state, isFiltering: true }
    case ACTIONS.NOT_FILTERING:
      return { ...state, isFiltering: false }
    default:
      if (isLemmata(payload)) {
        if (type === ACTIONS.SET_LEMMATA) {
          return { ...state, lemmata: payload }
        } else if (type === ACTIONS.SET_FILTERED_LEMMATA) {
          return { ...state, filteredLemmata: payload }
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

export const transfering = (dispatch: Dispatch<IAction>) => async (
  job: () => Promise<void>,
): Promise<void> => {
  dispatch({ type: ACTIONS.TRANSFERING })
  await job()
  dispatch({ type: ACTIONS.NOT_TRANSFERING })
}

type Ttransfering = typeof transfering

export const handleCreate = (transfering: Ttransfering) => (
  dispatch: Dispatch<IAction>,
) => (): Promise<void> =>
  transfering(dispatch)(async () => {
    await new HttpRequest().create('/create', exampleLemma)
    const r = (await new HttpRequest().read('/readAll')) as ILemma[]
    dispatch({ type: ACTIONS.SET_LEMMATA, payload: r })
  })

export const handleDelete = (transfering: Ttransfering) => (
  lemmata: IState['lemmata'],
  dispatch: Dispatch<IAction>,
) => (id: string) => async (): Promise<void> =>
  transfering(dispatch)(async () => {
    const r = (await new HttpRequest().delete(`/delete/${id}`)) as boolean

    if (r) {
      dispatch({
        type: ACTIONS.SET_LEMMATA,
        payload: lemmata.filter(({ _id }) => _id !== id),
      })
    }
    dispatch({ type: ACTIONS.SET_CURRENT_LEMMA_DETAIL, payload: null })
  })

export const handleUpdate = (transfering: Ttransfering) => (
  dispatch: Dispatch<IAction>,
) => (lemma: ILemma) => async (): Promise<void> =>
  transfering(dispatch)(async () => {
    const r = (await new HttpRequest().update(`/update/${lemma._id}`, lemma)) as boolean
  })

export const handleClickLemma = (
  lemmata: IState['lemmata'],
  dispatch: Dispatch<IAction>,
) => (id: string) => (): void => {
  const foundLemma = lemmata.find(({ _id }) => _id === id)

  if (foundLemma) {
    dispatch({ type: ACTIONS.SET_CURRENT_LEMMA_DETAIL, payload: foundLemma })
  } else {
    // TODO display error
    console.warn(`lemma at id:${id} not found`)
  }
}

export const handleSearch = (
  lemmata: IState['lemmata'],
  dispatch: Dispatch<IAction>,
) => (event: React.ChangeEvent<HTMLInputElement>): void => {
  const query = event.target.value.trim()

  if (query.length) {
    dispatch({ type: ACTIONS.FILTERING })
    // TODO search all text
    dispatch({
      type: ACTIONS.SET_FILTERED_LEMMATA,
      payload: lemmata.filter(({ lemma }) =>
        new RegExp(query, 'gi').test(lemma),
      ),
    })
  } else {
    dispatch({ type: ACTIONS.NOT_FILTERING })
  }
}

export const handleSearchEnter = (
  {
    lemmata,
    filteredLemmata,
    isFiltering,
  }: Pick<IState, 'lemmata' | 'filteredLemmata' | 'isFiltering'>,
  dispatch: Dispatch<IAction>,
) => (event: React.KeyboardEvent<HTMLInputElement>): void => {
  const { key } = event

  if (key.toLowerCase() === 'enter') {
    if (filteredLemmata.length) {
      dispatch({
        type: ACTIONS.SET_CURRENT_LEMMA_DETAIL,
        payload: filteredLemmata[0],
      })
    } else if (!isFiltering && lemmata.length) {
      dispatch({ type: ACTIONS.SET_CURRENT_LEMMA_DETAIL, payload: lemmata[0] })
    }
  }
}

export const handleEdit = (
  lemmata: IState['lemmata'],
  dispatch: Dispatch<IAction>,
) => (id: string) => (): void => {
  const foundLemma = lemmata.find(({ _id }) => _id === id)

  if (foundLemma) {
    dispatch({ type: ACTIONS.SET_CURRENT_LEMMA_EDIT, payload: foundLemma })
  } else {
    // TODO display error
    console.warn(`lemma at id:${id} not found`)
  }
}
