import * as React from 'react'
import MD from 'react-markdown'
import Gfm from 'remark-gfm'

import { IWord } from '/typings'

const Word: React.FC<IWord> = ({ class: classe, meanings, examples, memo }) => (
  <dl>
    <dt>Class</dt>
    <dd>{classe}</dd>
    <dt>Meanings</dt>

    <dd>
      <MD plugins={[Gfm]} children={meanings} />
    </dd>

    {examples && (
      <>
        <dt>Examples</dt>
        <dd>
          <MD plugins={[Gfm]} children={examples} />
        </dd>
      </>
    )}

    {memo && (
      <>
        <dt>Memo</dt>
        <dd>
          <MD plugins={[Gfm]} children={memo} />
        </dd>
      </>
    )}
  </dl>
)

export default Word
