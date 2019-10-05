/**
 *
 * @param a word to concatenate
 * @param b word to concatenate
 *
 * Concatenate two strings making sure there is one and only one slash between
 * the two
 */
export const concatSlash = (a, b) => {
   let right = +(a.slice(-1) === '/')
   let left = +(b[0] === '/')
   return a + [`/${b}`, b, b.slice(1)][right + left]
}
