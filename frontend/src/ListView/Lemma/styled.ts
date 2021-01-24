import styled from 'styled-components'

export const Wrapper = styled.a<{ active: boolean }>`
  display: block;
  padding: 0.5rem 1rem;
  border-bottom: solid 1px lightgrey;
  cursor: pointer;
  background: ${({ active }) => (active ? '#fee' : 'transparent')};
  &:hover {
    background: #eee;
  }
`

export const Title = styled.span`
  font-size: 1.5rem;
  line-height: 2rem;
`

export const Lang = styled.span`
  padding: 0 0.5rem;
  font-size: 1rem;
  font-style: oblique;
  color: grey;
`
