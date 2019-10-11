### 1. Add the library to your JS / TS project

With yarn / npm:

```sh
yarn add graphql-rest fetch
npm install --save graphql-rest fetch
```

You'll want to use apollo-server and nodemon for a greater GraphQL development
experience. Install them with one of:

```sh
yarn add --dev apollo-server nodemon
npm install --save-dev apollo-server nodemon
```

### 2. Instantiate GraphqlRest

A. Create `mySchema.gql`

```gql
type Query {
  hello: Int
}
```

B. Create `server.js` and add:

```ts
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
```

C. Run the Apollo Server with nodemon (replace `yarn` by `npx` if you use npm):

```sh
yarn nodemon --ext .gql server.js
```

You will get an output like:

```txt
[nodemon] 1.19.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node server.js`
Serving the GraphQL Playground on http://localhost:4000/playground
```

Open your browser to http://localhost:4000/playground, where the GraphQL playground runs.

Note:
If you are going to be using GraphqlRest in a web browser, consider using node
while developing the GraphQL schema for the API.

### 3. Develop your annotated GraphQL Schema

Start editing `mySchema.gql`. Add the `@from` directive header, add the
`@from(configUrlBase: "...")` configuration, and put
`@from(get: "url_end_with_where/:x/will_be_substituted")`

```gql
# This header declares the `from` directive that GraphqlRest implements
directive @from(
  "Config"
  configUrlBase: String
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
    page: Int = 1
    perpage: Int = 15
  ): SearchPage!
    @from(get: "/search.json?q=:query&sf=:sort&page=:page&perpage=:perpage")
}

scalar Date
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
  description: String
  score: Int!
  url: Url
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
  images(
    sort: SortFieldInput = created_at
    page: Int = 1
    perpage: Int = 50
  ): SearchPage
    @from(
      get: "/search.json?q=uploader_id%3A:id&sf=:sort&page=:page&perpage=:perpage"
    )
}
```
