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
import { DictionarySchema, MyDictionarySchema } from './schema';
import { PaginationInputSchema, PaginationSchema, ResultBase, createResultModel, createResultPagination } from '../common';
import VideoRepository from '../../repository/Video';
import DictionaryRepository from '../../repository/Dictionary';
import { PaginationInput } from '../../model/common';

// Create the GraphQL schema
const dictionaryrepo = new DictionaryRepository()
const PaginationDictionaryResult = createResultPagination('Dictionary', DictionarySchema)
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			searchDictionary: {
				type: PaginationDictionaryResult,
				args: {
					word: {
						type: GraphQLString
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						let data = await dictionaryrepo.getWord(args.word)
						return {
							total: data.length,
							data: data
						}
					} catch (error) {
						console.error(error)
					}
				},
			},
			dictionaryByVideo: {
				type: createResultPagination('DictionaryByVideo', MyDictionarySchema),
				args: {
					VideoId: {
						type: new GraphQLNonNull(GraphQLString)
					},
					pagination: {
						type: PaginationInputSchema
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const pagination = PaginationInput.parse(args.pagination)
						let data = await dictionaryrepo.getWordByVideo(context.user.id, args.VideoId,pagination)
						return data
					} catch (error) {
						console.error(error)
					}
				},
			},

		}
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			createDictionaryByVideo: {
				type: createResultModel('MyDictionaryResult', MyDictionarySchema),
				args: {
					VideoId: {
						type: new GraphQLNonNull(GraphQLString)
					},
					word: {
						type: new GraphQLNonNull(GraphQLString)
					},
					start: {
						type: new GraphQLNonNull(GraphQLFloat)
					},
					dur: {
						type: new GraphQLNonNull(GraphQLFloat)
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						let data = await dictionaryrepo.createWordByVideo(context.user.id, args.VideoId, args.start, args.dur, args.word)
						if (data) {
							return {
								success: true,
								code: 0,
								data
							};
						}
						return {
							success: false,
							code: 2
						};
					} catch (error) {
						return {
							success: false,
							code: 1
						};
					}
				},
			},
			deleteDictionaryByVideo: {
				type: ResultBase,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLInt)
					},
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						let data = await dictionaryrepo.deleteWordByVideo(context.user.id, args.id)
						if (data) {
							return {
								success: true,
								code: 0
							};
						}
						return {
							success: false,
							code: 2
						};
					} catch (error) {
						return {
							success: false,
							code: 1
						};
					}
				},
			}
		}
	})
});
export default schema