export interface IWord {
  class: string
  meanings: string
  examples: string
  memo: string
}

export interface ILemma<T extends IWord = IWord> {
  _id: string
  lang: string
  lemma: string
  words: T[]
  tags: []
}

interface IWordEdit {
  index: number
  setFormData: Function
}

export interface IAdverb extends IWord {
  class: 'adverb'
}

export interface IAdverbEdit extends IAdverb, IWordEdit {}

export interface IInterjection extends IWord {
  class: 'interjection'
}

export interface IInterjectionEdit extends IAdverb, IWordEdit {}

/* French */
export type TFrenchWord = IAdverb | IInterjection
export type TFrenchWordEdit = IAdverbEdit | IInterjectionEdit
export type TFrench = TFrenchWord | TFrenchWordEdit

export interface IFrenchLemma extends ILemma<TFrench> {
  lang: 'fr'
}

/* Russian */
/* Chinese */
/* Hebrew */
/* Turkish */
/* Arabic */
/* Korean */
