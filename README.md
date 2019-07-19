<img alt="GraphQL Rest Logo" src="doc/logo.svg" width="160" />

# graphql-rest

Because programming with REST APIs is so boringly slow, and because GraphQL
APIs are so Great!

This module allows you to GraphQL-ify any (json) REST API by writing only
GraphQL. This is possible thanks to GraphQL directives (aka. GraphQL
annotations), and made easy to implement by the graphql-tools module from the
Apollo GraphQL project.

## 1. Add the library to your JS / TS project

With yarn:

```sh
yarn add graphql-rest fetch graphql
```

With npm:

```sh
npm install --save graphql-rest fetch graphql
```

You might want to use apollo-server and nodemon for a greater GraphQL
development experience:

```sh
yarn add --dev apollo-server nodemon
```

## 2. Instantiate GraphqlRest

`graphqlRestServe.js`

Import the dependencies

- commonjs style, if you use vanilla node:

```ts
const { readFileSync } = require('fs')

const fetch = require('node-fetch')
const { ApolloServer } = require('apollo-server')
const { GraphqlRest } = require('graphql-rest')
```

- es6 style:

```ts
import { readFileSync } from 'fs'

import fetch from 'node-fetch'
import { ApolloServer } from 'apollo-server'
import { GraphqlRest } from 'graphql-rest'
```

Start the server:

```ts
const PORT = 4000

let myApiGraphqlSchema = readFileSync(
  `${__dirname}/myPath/mySchema.gql`,
  'utf-8',
)

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
```

Then run the Apollo Server with nodemon (replace `yarn` by `npm run` if you use npm):

```sh
yarn nodemon --ext .gql graphqlRestServe.js
```

If you are going to be using GraphqlRest in a web browser, consider using node
while developing the GraphQL schaema for the API.

## 3. Write the annotated GraphQL Schema

`myPath/mySchema.gql`

```gql
# This header declares the `from` directive that GraphqlRest implements
directive @from(
  "Config"
  configUrlBase: String
  configQueryStringAdditions: [String]
  "Rename a REST result property"
  prop: String
  "REST calls"
  get: String
  delete: String
  patch: String
  post: String
  put: String
  "Specify a path to the property in the JSON result to use as field value"
  root: String
) on OBJECT | FIELD_DEFINITION
# Passing { addHeader: true } allows to omit the header, but is not recommended
# if you are going to use any GraphQL linting tool, as the GraphQL specification
# requires declaring the directives you use

# Using @from(get) allows you to specify the URL and REST method to use for the
# resolver. Any word preceded by `:` will undergo substitution
# A word is /[A-Za-z_]+/
type Query @from(configUrlBase: "https://myApiUrlBase.org/v2/") {
  image(id: ID!): Image @from(get: "/:id.json")
  user(name: ID!): User @from(get: "/profiles/:name.json")
  search(
    query: String!
    sort: SortFieldInput = created_at
    order: SortOrderInput = desc
    page: Int = 1
    perpage: Int = 15
  ): SearchPage!
    @from(
      get: "/search.json?q=:query&sf=:sort&sd=:order&page=:page&perpage=:perpage"
    )
}

scalar CommaSpaceSeparatedString
scalar Date
scalar Extension
scalar Mime
scalar Sha512
scalar Url

enum SortFieldInput {
  created_at
  score
  random
}

# Here things get interesting, see the substitution is not only possible with
# GraphQL arguments, but also with the values returned from the REST API call.
# If you are familiar with GraphQL resolvers, here `:uploader_id` is found in
# the `parent` (or `source` ) field of the resolver. This is what enables the
# nesting power of GraphQL
type Image {
  representations: Representations
  score: Int!
  updated_at: Date!
  uploader_id: ID
  uploader_info: User @from(get: "/profiles/:uploader_id.json")
}

type SearchPage {
  search: [Image!]!
  total: Int!
}

type User {
  id: ID
  name: String!
}
```

## Development

### Done

1. [x] Ability to rename a REST property via annotation

### Coming soon

1. [ ] Document the other useful properties of GraphqlRest instances
1. [ ] Documented way to use the library outside of development context
1. [ ] Documented way to make a GraphQL use as a library
1. [ ] Document the lesser useful proporties of GraphqlRest instances
1. [ ] Support for custom annotations with altered behaviour
1. [ ] Support for GraphQL resolving list types from argument lists stacked type modifier, such as `[[ID]]` , `[ID!]` , `[ID]!` , `[[[ID!]!]!]!`
1. [ ] Ability to specify a property to use in the JSON response rather the JSON root
1. [ ] Ability to specify a JSON path to a `root` field in the JSON response
1. [ ] Ability to access JSON nested properties when renaming a property
