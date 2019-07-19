// Type
import { Fetch } from './type'

// JS
import { buildSchema, graphql, Source, ExecutionResult } from 'graphql'

import { populateResolvers } from './step/populateResolvers'
import ono from 'ono'
import { ExecutionResultDataDefault } from 'graphql/execution/execute'

let cached = (() => {
   let cache = {}
   return <T>(f: () => T): T => {
      let key = `${f}`
      if (!(key in cache)) {
         cache[key] = f()
      }
      return cache[key]
   }
})()

type QueryResult = ExecutionResult<ExecutionResultDataDefault>

export class GraphqlRest {
   prop: {
      fetch: Fetch
   }
   annotatedSchemaText: string
   constructor(annotatedSchemText, prop) {
      this.annotatedSchemaText = annotatedSchemText
      this.prop = prop
   }
   get annotatedSchema() {
      return cached(() => buildSchema(this.annotatedSchemaText))
   }
   get schema() {
      return cached(() => {
         let schema = this.annotatedSchemaText
         return populateResolvers(schema, this.prop.fetch)
      })
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
