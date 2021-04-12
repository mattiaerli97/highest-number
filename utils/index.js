export const trimElement = (elm, chars) => {
  return elm.length > chars ? elm.substring(0, chars - 3) + '...' : elm
}
