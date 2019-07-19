import { entries } from './object'

export const extract = <T>(
   keyList: string[],
   obj: Record<any, T>,
): [string, T][] => {
   return entries(obj).filter(([key, value]) => {
      return keyList.includes(key) && value !== undefined
   })
}
