import * as React from 'react'

import { Input } from './styled'

interface IProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyUp: (event: React.KeyboardEvent<HTMLInputElement>) => void
}

const Search: React.FC<IProps> = ({ onChange, onKeyUp }) => (
  <Input
    onChange={onChange}
    onKeyUp={onKeyUp}
    placeholder="Search Lemma..."
    autoFocus
  />
)

export default Search
