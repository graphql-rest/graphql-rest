// Type
import { Fetch } from './type'
import { ExecutionResultDataDefault } from 'graphql/execution/execute'

import { FromDirectiveConfig, GraphqlRestConfig } from './step'

// JS
import ono from 'ono'
import { buildSchema, graphql, Source, ExecutionResult } from 'graphql'
import { makeExecutableSchema } from 'graphql-tools'

import { applyVisit, graphqlRestVisitor } from './step'

type QueryResult = ExecutionResult<ExecutionResultDataDefault>

type GraphqlRestProp = {
   fetch: Fetch
   config: Partial<FromDirectiveConfig>
}

export class GraphqlRest {
   prop: GraphqlRestProp
   rawSchemaText: string

   constructor(rawSchemaText: string, prop: GraphqlRestProp) {
      this.rawSchemaText = rawSchemaText
      this.prop = prop
   }
   get rawSchema() {
      return buildSchema(this.rawSchemaText)
   }
   get schema() {
      let schema = makeExecutableSchema({ typeDefs: this.rawSchemaText })
      let visitorSet = graphqlRestVisitor(this.prop)
      applyVisit(schema, visitorSet)
      visitSchema(schema, this.prop.fetch)
      return schema
   }
   async query(source: Source | string): Promise<QueryResult> {
      return await graphql(this.schema, source)
   }
   gql = (arr, ...args) => async (variables) => {
      let source = String.raw(arr, ...args)
      let result = await graphql(this.schema, source, {}, {}, variables)
      return result
   }
   gqldata = (arr, ...args) => async (variables) => {
      let result = await this.gql(arr, ...args)(variables)
      if (result.errors) {
         throw ono('(graphql-rest) <gqldata``> request failed', result.errors)
      }
      return result.data
   }
}
