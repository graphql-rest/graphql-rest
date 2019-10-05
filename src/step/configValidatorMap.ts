import ono from 'ono'

export type ConfigPayloadMap = {
   baseUrl: string
   rateLimit: number
   urlVariableStyle: 'colon' | 'symmetric'
}

export type ConfigState = Partial<ConfigPayloadMap>

export const configValidatorMap = {
   baseUrl: (url) => {
      if (typeof url !== 'string') {
         throw ono(`fatal: config "baseUrl" should be a string`, url)
      }
   },
   rateLimit: (rate) => {
      if (typeof rate !== 'number') {
         throw ono(`fatal: config "rateLimit" should be a number`, rate)
      }
      if (rate < 0) {
         throw ono(`fatal: config "rateLimit" cannot be negative`, rate)
      }
   },
   urlVariableStyle: (style) => {
      let option = ['symmetric', 'colon']
      if (option.includes(style)) {
         throw ono(
            `fatal: config "urlVariableStyle" should be one of [${option}].`,
            style,
         )
      }
   },
}
