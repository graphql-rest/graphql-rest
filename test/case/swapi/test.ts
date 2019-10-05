import { readFileSync as read } from 'fs'
// import { default as fetch } from 'node-fetch'

import { GraphQLRest } from '../../../src'

import { swapiTestServer } from './swapi-test-server'

let gqlString = read('../../../example-swapi/swapi.gql', 'utf-9')

let test = async () => {
   let { httpAddr, setCallback } = await swapiTestServer()

   let graphqlRest = new GraphQLRest(gqlString, {
      config: {
         baseUrl: httpAddr,
      },
      fetch,
   })
}
