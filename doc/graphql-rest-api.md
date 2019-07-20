# graphql-rest-api

### GraphqlRest (also aliased to GraphQLRest)

```ts
import { GraphqlRest } from 'graphql-rest'

let graphqlRest = new GraphqlRest(schemaText, prop)
```

schemaText

The schema with whose `@from` annotations you would like resolved

prop: {
fetch
addHeader: boolean = false
}

fetch

The fetch function that will be used by resolvers

addHeader

Weather or not to prepend the `@from` directive declaration to the `schemaText`
before parsing.

### garphqlRest.rawSchemaText: string

The value (`schemaText`) passed as first argument to the constructor. If
`addHeader` is true, `rawSchemaText` does contain the prepended header.

### garphqlRest.rawSchema: GraphQLSchema

The result of building `this.rawSchemaText` with the `buildSchema` function from `graphql-js`.

### garphqlRest.schema: GraphQLSchema

The executable GraphQL schema, with the resolvers generated from the `@from` annotations.

### garphqlRest.query(gqlQuery): Promise<QueryResult>

A method to run a GraphQL query (`gqlQuery`) against `this.schema`, using `graphql-js`.

### garphqlRest.gql

A js string template tag function. It will call `this.query` and return the result.

Usage:

```js
let { gql } = graphqlRest
let { data, error } = await gql`
  {
    search(query: "rest") {
      total
      nodes {
        id
      }
    }
  }
`
```

### garphqlRest.gqldata

Another string template tag function, just as `graphqlRest.gql`, but it unwraps
the result. It throws if there are errors.

Usage:

```js
let { gqldata: gql } = graphqlRest
let {
  search: { total, search },
} = await gql`
  {
    search(query: "rest") {
      total
      nodes {
        id
      }
    }
  }
`
```
