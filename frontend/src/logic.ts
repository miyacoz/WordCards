import { Dispatch } from 'react'

import { ILemma } from '/typings'
import { ACTIONS, IAction, IState } from './reducer'
import HttpRequest from '/HttpRequest'

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
    await new HttpRequest().delete(`/delete/${id}`)
    const r = (await new HttpRequest().read('/readAll')) as ILemma[]
    dispatch({ type: ACTIONS.LEMMA_DELETED, payload: r })
  })

export const handleUpdate = (transfering: Ttransfering) => (
  dispatch: Dispatch<IAction>,
) => (lemma: ILemma) => async (): Promise<void> =>
  transfering(dispatch)(async () => {
    const r = (await new HttpRequest().update(
      `/update/${lemma._id}`,
      lemma,
    )) as boolean
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
    dispatch({ type: ACTIONS.FILTERING, payload: query })
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
