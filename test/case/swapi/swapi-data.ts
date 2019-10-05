import { readFileSync as read } from 'fs'

export interface SwapiEntry {
   fields: Record<string, any>
   model: string
   pk: number
}

export const load = () => {
   let data: Record<string, any> = {}
   ;[
      'films',
      'people',
      'planets',
      'species',
      'starships',
      'transport',
      'vehicles',
   ].forEach((name) => {
      let content: SwapiEntry[] = JSON.parse(read(`db/${name}.json`, 'utf-8'))
      data[name] = content.map(({ fields, pk }) => ({ ...fields, id: pk }))
   })

   return data
}
