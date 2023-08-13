import {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLBoolean,
	GraphQLFloat,
	GraphQLEnumType,
	GraphQLList,
	GraphQLString,
	GraphQLInt,
	GraphQLNonNull,
	GraphQLInputObjectType,
	GraphQLFieldConfig,
	getNamedType,
	GraphQLResolveInfo
} from 'graphql';
import { DictionarySchema } from './schema';
import { ResultBase, createResultPagination } from '../common';
import VideoRepository from '../../repository/Video';
import DictionaryRepository from '../../repository/Dictionary';

// Create the GraphQL schema
const dictionaryrepo = new DictionaryRepository()
const PaginationDictionaryResult = createResultPagination('Dictionary', DictionarySchema)
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			searchDictionary: {
				type: PaginationDictionaryResult,
				args:{
					word:{
						type:GraphQLString
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						let data = await dictionaryrepo.getWord(args.word)
						return {
							total:data.length,
							data:data
						}
					} catch (error) {
						console.error(error)
					}
				},
			},
		}
	}),
	// mutation: new GraphQLObjectType({
	// 	name: 'Mutation',
	// 	fields: {
	// 	}
	// })
});
export default schema