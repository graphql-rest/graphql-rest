const { readFileSync } = require('fs')

const fetch = require('node-fetch')
const { ApolloServer } = require('apollo-server')
const { GraphqlRest } = require('../dist')

const PORT = 4000

let { schema } = new GraphqlRest(
   readFileSync(`${__dirname}/mySchema.gql`, 'utf-8'),
   { fetch },
)

let server = new ApolloServer({ schema })

server.listen({ port: PORT }).then(({ port }) => {
   console.log(
      `Serving the GraphQL Playground on http://localhost:${port}/playground`,
   )
})
