export const capitalise = (text: string): string => {
  return text.length ? text[0].toUpperCase() + text.split('').filter((_, i) => i !== 0).join('') : text
}
