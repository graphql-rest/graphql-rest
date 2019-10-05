import { RequestHandler, Request } from 'express'

export interface Dynamic {
   middleware: RequestHandler
   setCallback: (newCallback: Callback) => void
}

export type Callback = (req: Request) => any

export let createDynamic = () => {
   let callback: Callback = () => {}

   let middleware: RequestHandler = (req, res, next) => {
      callback(req)
      next()
   }

   let setCallback = (newCallback: Callback) => {
      callback = newCallback
   }

   return { middleware, setCallback }
}
