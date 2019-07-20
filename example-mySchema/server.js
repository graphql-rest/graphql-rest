const { readFileSync } = require('fs')

const fetch = require('node-fetch')
const { ApolloServer } = require('apollo-server')
const { GraphqlRest } = require('graphql-rest')

const PORT = 4000

let myApiGraphqlSchema = readFileSync(`${__dirname}/mySchema.gql`, 'utf-8')

let myGraphqlApi = new GraphqlRest(myApiGraphqlSchema, { fetch })

let { schema } = myGraphqlApi

let server = new ApolloServer({
   schema,
})

server.listen({ port: PORT }).then(() => {
   console.log(
      `Serving the GraphQL Playground on http://localhost:${PORT}/playground`,
   )
})
