export const concatSlash = (a, b) => {
   let right = +(a.slice(-1) === '/')
   let left = +(b[0] === '/')
   return a + [`/${b}`, b, b.slice(1)][right + left]
}
