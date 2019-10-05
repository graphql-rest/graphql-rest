// Types
import { GraphQLField, GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql'

import { Fetch } from '../type'

type GetValue = (
   parent: Record<any, any>,
   args: Record<any, any>,
   context: any,
   info: GraphQLResolveInfo,
) => string

type GetGetValue = (param: {
   name: string
   field: GraphQLField<any, any>
}) => GetValue

type Pair = [string, string]

type Resolver = GraphQLFieldResolver<Record<any, any>, any>
type UResolver = Resolver | undefined

export type FromDirectiveConfig = {
   configSep: string
   configUrlBase: string
}

export type FromDirectiveProp = {
   fetch: Fetch
   config: Partial<FromDirectiveConfig>
   configOverride?: Partial<FromDirectiveConfig>
}

export type GraphqlRestConfig = {}

export const graphqlRestVisitor = () => {}
