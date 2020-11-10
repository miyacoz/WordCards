import * as React from 'react'
import MD from 'react-markdown'
import Gfm from 'remark-gfm'

import { IWord } from './typings'

const Word: React.FC = (props: IWord) => (
  <dl>
    <dt>Class</dt>
    <dd>{props.class}</dd>
    <dt>Meanings</dt>

    <dd>
      <MD plugins={[Gfm]} children={props.meanings} />
    </dd>

    {props.examples && <>
      <dt>Examples</dt>
      <dd>
        <MD plugins={[Gfm]} children={props.examples} />
      </dd>
    </>}

    {props.memo && <>
      <dt>Memo</dt>
      <dd>
        <MD plugins={[Gfm]} children={props.memo} />
      </dd>
    </>}
  </dl>
)

export default Word
