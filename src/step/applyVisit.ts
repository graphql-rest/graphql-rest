import { SchemaDirectiveVisitor } from 'graphql-tools'
import { GraphQLSchema } from 'graphql'

export interface VisitorSet {
   preSchema: (schema: GraphQLSchema) => void
   directiveList: [
      {
         [directiveName: string]: typeof SchemaDirectiveVisitor
      },
   ]
   postSchema: (schema: GraphQLSchema) => void
}

export const applyVisit = (schema: GraphQLSchema, visitorSet: VisitorSet) => {
   let { directiveList, postSchema, preSchema } = visitorSet

   preSchema(schema)

   directiveList.forEach((mapping) => {
      SchemaDirectiveVisitor.visitSchemaDirectives(schema, mapping)
   })

   postSchema(schema)
}
