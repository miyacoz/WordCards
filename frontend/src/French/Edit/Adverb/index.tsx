import * as React from 'react'

import { Box } from './styled'
import { IAdverbEdit } from '/typings'
import WordEdit from '/WordEdit'

const Adverb: React.FC<IAdverbEdit> = props => (
  <Box>
    <WordEdit {...props} />
  </Box>
)

export default Adverb
