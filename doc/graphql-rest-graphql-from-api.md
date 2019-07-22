# graphql-rest-graphql-from-api

## The header to declare the `@from` directive

```gql
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
```

## Configuration

`type Query @from(`

Configuration subdirectives can be set on any type declaration. A configuration
set more than once will throw an error and prevent the creation of the schema.

`configUrlBase: "https://api.ofTheWebsite.com/api/v5"`

The `configUrlBase` config it is mandatory. The url base is used as string prefix for all urls. A slash will be added or removed to or from the end of the
string to garantee there is one and only one slash between the two parts of the
url.

`) {}`

## REST methods

`@from(get: "/user")`
`@from(delete: "/user/:id")`
`@from(patch: "/user/:id")`
`@from(post: "/user")`
`@from(put: "/user/:id")`

REST subdirectives are only available on GraphQL fields. They add a resolver
querying the given URL. Only one REST subdirective may be set on any given
field, or graphql-rest will throw.

## More methods

`@from(root: "data")`

Usefull when the JSON returned from the API is wrapped inside a structure:

```
{
  errors: null,
  data: {
    id: 12,
    name: "Starlight",
    description: "Not really",
    created_at: "2019-07-12T01:31:42.468Z"
  }
}
```
