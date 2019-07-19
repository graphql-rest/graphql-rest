// export const keys = (obj) => Object.keys(obj)
// export const values = (obj) => Object.values(obj)
export const entries = <T>(obj: Record<any, T>): [string, T][] => {
   return Object.entries(obj)
}
// export const objlen = (obj) => Object.keys(obj).length

export const fromEntries = <T>(iterable: [string, T][]): Record<string, T> => {
   let obj = {}
   ;[...iterable].forEach(([k, v]) => {
      obj[k] = v
   })
   return obj
}
