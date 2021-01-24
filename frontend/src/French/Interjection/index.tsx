import * as React from 'react'

import { IInterjection } from '/typings'
import { Box } from './styled'
import Word from '/Word'

const Interjection: React.FC<IInterjection> = props => (
  <Box>
    <Word {...props} />
  </Box>
)

export default Interjection
