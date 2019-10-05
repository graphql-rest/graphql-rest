import { default as express } from 'express'

import { router as jsonRouter } from 'json-server'

import { createDynamic } from './dynamic-middleware'
import { load } from './swapi-data'

export const swapiTestServer = async () => {
   let server = express().set('json spaces', 2)

   let dynamic = createDynamic()

   let data = load()

   server.use(jsonRouter(data))
   server.use(dynamic.middleware)

   let httpAddr = await new Promise((resolve, reject) => {
      let listener = server.listen(() => {
         let address = listener.address()
         if (address) {
            let httpAddr: string
            if (typeof address === 'string') {
               httpAddr = address
            } else {
               let { port } = address
               httpAddr = `http://localhost:${port}`
            }
            resolve(httpAddr)
         } else {
            reject('Server should be running, but (listener.address()) is null')
         }
      })
   })

   return {
      httpAddr,
      setCallback: dynamic.setCallback,
   }
}
