export interface IWord {
  class: string
  meanings: string
  examples: string
  memo: string
}

export interface ILemma<T extends IWord> {
  _id: string
  lang: string
  lemma: string
  words: T[]
  tags: []
}
