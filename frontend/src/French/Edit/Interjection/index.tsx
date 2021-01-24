import * as React from 'react'

import { Box } from './styled'
import { IInterjectionEdit } from '/typings'
import WordEdit from '/WordEdit'

const Interjection: React.FC<IInterjectionEdit> = props => (
  <Box>
    <WordEdit {...props} />
  </Box>
)

export default Interjection
