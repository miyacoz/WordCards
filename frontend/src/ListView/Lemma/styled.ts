import styled from 'styled-components'

export const Wrapper = styled.a`
  display: block;
  padding: 0.5rem 1rem;
  border-bottom: solid 1px lightgrey;
  cursor: pointer;
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
