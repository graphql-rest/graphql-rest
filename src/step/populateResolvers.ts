// Types
import {
   GraphQLField,
   GraphQLFieldResolver,
   GraphQLObjectType,
   GraphQLResolveInfo,
} from 'graphql'

import { ITypeDefinitions } from 'graphql-tools'

import { Fetch } from '../type'

// JS
import * as url from 'url'

import ono from 'ono'

import { SchemaDirectiveVisitor, makeExecutableSchema } from 'graphql-tools'

import { concatSlash, extract, fromEntries, keys } from '../util'

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
   configUrlBase: string
   configQueryStringAdditions: string[]
}

export type FromDirectiveProp = {
   fetch: Fetch
   config: Partial<FromDirectiveConfig>
}

let getFromDirective = (prop: FromDirectiveProp) => {
   let resolverCount = 0

   class FromDirective extends SchemaDirectiveVisitor {
      name!: string
      args!: Record<string, any>

      extract(keyString: string) {
         return extract(keyString.split(' '), this.args)
      }
      extractConfig() {
         let configPairList: Pair[] = this.extract(
            'configUrlBase configQueryStringAdditions',
         )
         let configAdditions = fromEntries(configPairList)
         return configAdditions
      }
      getGetValue: GetGetValue = ({ name, field }) => (
         parent,
         args,
         context,
         info,
      ) => {
         let value = args[name]
         if (value === undefined) {
            value = (parent || {})[name]
         }
         if (value === undefined) {
            throw ono(
               `could not find "${name}" neither in args, nor in the parent JSON`,
               { field, args, parent },
            )
         }
         if (typeof value !== 'string' && typeof value !== 'number') {
            throw ono(`unexpected type`, { name, value })
         }
         return `${value}`
      }
      resolverFromRestParameter(field: GraphQLField<any, any>) {
         let restKeyList: Pair[] = this.extract('get delete patch post put')
         if (restKeyList.length > 1) {
            throw ono('Several rest subdirectives supplied', restKeyList, field)
         }
         if (restKeyList.length == 1) {
            let [[method, uriTemplate]] = restKeyList
            let partList = uriTemplate.split(/\b|\B(?=\W)/)
            let replaceList: { getValue: GetValue; regex: RegExp }[] = []

            partList.forEach((part, i) => {
               if (part === ':') {
                  let name = partList[i + 1]
                  if (name !== undefined && name !== '') {
                     let getValue = this.getGetValue({ name, field })
                     replaceList.push({
                        getValue,
                        regex: new RegExp(`:${name}\\b`, 'g'),
                     })
                  }
               }
            })

            let resolver: Resolver = async (s, a, c, i) => {
               try {
                  let args = a
                  if (args.length) {
                     console.log({ args, thargs: this.args })
                  }
                  let uri = uriTemplate
                  replaceList.forEach(({ getValue, regex }) => {
                     let value = getValue(s, args, c, i)
                     uri = uri.replace(regex, value)
                  })
                  let concatUrl = concatSlash(prop.config.configUrlBase, uri)
                  let urlObj = new url.URL(concatUrl)
                  let qs = prop.config.configQueryStringAdditions || []
                  qs.forEach((param) => {
                     let [key, value] = param.split('=')
                     urlObj.searchParams.append(key, value)
                  })
                  let restResponse = await prop.fetch(urlObj.href, {
                     method: method.toUpperCase(),
                  })
                  let result = await restResponse.json()
                  return result
               } catch (e) {
                  console.error(e.stack)
                  throw e
               }
            }

            return resolver
         }
      }
      resolverFromPropertyParameter() {
         let [kv]: Pair[] = this.extract('prop')
         if (kv) {
            let [_k, propName] = kv
            let resolver = (parent: Record<any, any>) => {
               return parent[propName]
            }
            return resolver
         }
      }
      visitFieldDefinition(
         field: GraphQLField<any, any>,
      ): GraphQLField<any, any> {
         // Rest Parameters //
         let restResolver: UResolver = this.resolverFromRestParameter(field)
         let propertyResolver: UResolver = this.resolverFromPropertyParameter()

         if (restResolver && propertyResolver) {
            throw ono(
               'Rest parameters supplied along with property parameter',
               this.args,
               field,
            )
         }

         let resolver: UResolver = restResolver || propertyResolver
         if (resolver) {
            resolverCount += 1
            field.resolve = resolver
         }
         let newField: GraphQLField<any, any> = { ...field }
         return newField
      }
      visitObject(object: GraphQLObjectType): GraphQLObjectType {
         // Config Parameters //
         let config = this.extractConfig()
         keys(config).forEach((k) => {
            if (prop.config[k] !== undefined) {
               throw ono(
                  [
                     `configuration ${k} specified twice -`,
                     `- (value: [${prop.config[k]}], [${config[k]}])`,
                  ].join(),
               )
            }
         })
         if (config) {
            prop.config = config
         }
         return object
      }
   }

   let postSchema = () => {
      if (resolverCount > 0 && prop.config.configUrlBase === undefined) {
         throw ono('No base url configured', prop.config)
      }
   }

   return {
      fromDirectiveClass: FromDirective,
      postSchema,
   }
}

export const populateResolvers = (typeDefs: ITypeDefinitions, fetch: Fetch) => {
   let prop = {
      fetch,
      config: {
         configUrlBase: undefined,
         configQueryStringAdditions: undefined,
      },
   }
   let { fromDirectiveClass, postSchema } = getFromDirective(prop)
   let schema = makeExecutableSchema({
      typeDefs: typeDefs,
      schemaDirectives: {
         from: fromDirectiveClass,
      },
   })
   postSchema()
   return schema
}
