import { createOxider, entries } from '../util'
// TS
import { ConfigState, ConfigPayloadMap } from './configValidatorMap'

// JS
import ono from 'ono'

import { configValidatorMap } from './configValidatorMap'

let checkSet: {
   [A in keyof typeof configValidatorMap]: (
      state: ConfigState,
      payload: any,
   ) => ConfigState
} = {} as any

entries(configValidatorMap).forEach(([k, validate]) => {
   checkSet[k] = (state, payload) => {
      if (state[k] !== undefined) {
         throw ono(`fatal: config ${k} was set twice`)
      }
      validate(payload)
      return { ...state, [k]: payload }
   }
})

export const configOx = createOxider<ConfigState, ConfigPayloadMap>(
   {
      ...checkSet,
   },
   {},
)

export const resolverCountOx = createOxider(
   {
      increment: (x) => x + 1,
   },
   0,
)
