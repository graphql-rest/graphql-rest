export type Change<Tstate> = (state: Tstate) => Tstate

export type ActionMap<Tstate, Tpayloadmap extends object> = {
   [A in keyof Tpayloadmap]: (state: Tstate, payload: Tpayloadmap[A]) => Tstate
}

export type BoundActionMap<Tpayloadmap extends object> = {
   [A in keyof Tpayloadmap]: (payload: Tpayloadmap[A]) => void
}

export type UnboundMap<Tstate, Tpayloadmap extends object> = {
   [A in keyof Tpayloadmap]: (payload: Tpayloadmap[A]) => Change<Tstate>
}

export interface Oxider<Tstate, Tpayloadmap extends object> {
   unbound: UnboundMap<Tstate, Tpayloadmap>
   createBoundStore: () => BoundActionMap<Tpayloadmap>
}

export const createOxider = <Tstate, Tpayloadmap extends object>(
   actionMap: ActionMap<Tstate, Tpayloadmap>,
   initValue: Tstate,
): Oxider<Tstate, Tpayloadmap> => {
   let unbound: Oxider<Tstate, Tpayloadmap>['unbound'] = {} as any
   Object.keys(actionMap).forEach((key) => {
      let act = actionMap[key]
      unbound[key] = (payload) => (state) => act(state, payload)
   })

   return {
      unbound,
      createBoundStore: () => {
         let state = initValue
         let boundStore: BoundActionMap<Tpayloadmap> = (() => state) as any
         Object.keys(actionMap).forEach((key) => {
            let act = actionMap[key]
            boundStore[key] = (payload) => {
               state = act(state, payload)
            }
         })
         return boundStore
      },
   }
}
