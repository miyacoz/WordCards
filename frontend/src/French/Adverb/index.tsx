import * as React from 'react'

import { IAdverb } from '/typings'
import { Box } from './styled'
import Word from '/Word'

const Adverb: React.FC<IAdverb> = props => (
  <Box>
    <Word {...props} />
  </Box>
)

export default Adverb
