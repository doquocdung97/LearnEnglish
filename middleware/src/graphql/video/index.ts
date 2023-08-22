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
import { VideoSchema } from './schema';
import { ResultBase, createResultPagination } from '../common';
import VideoRepository from '../../repository/Video';

// Create the GraphQL schema
const videorepo = new VideoRepository()
const PaginationVideosResult = createResultPagination('Videos', VideoSchema)
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			videos: {
				type: PaginationVideosResult,
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						// return await userrepo.getUserByToken(context.headers.authorization)
					} catch (error) {
						console.error(error)
					}
				},
			},
			video: {
				type: VideoSchema,
				args: {
					id: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						return await videorepo.get(args.id, context.headers.lang)
					} catch (error) {
						console.error(error)
					}
				},
			},
			myVideos: {
				type: PaginationVideosResult,
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						if (context.user) {
							const videos = await videorepo.myVideos(context.user.id);
							return {
								total: videos.length,
								data: videos
							};
						}

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
			createMyVideo: {
				type: ResultBase,
				args: {
					videoId: {
						type: GraphQLString
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const status = await videorepo.createMyVideo(context.user?.id, args.videoId);
						if (status) {
							return {
								success: status,
								code: 0
							};
						}
						return {
							success: status,
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
			deleteMyVideo: {
				type: ResultBase,
				args: {
					videoId: {
						type: GraphQLString
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const status = await videorepo.deleteMyVideo(context.user?.id, args.videoId);
						if (status) {
							return {
								success: status,
								code: 0
							};
						}
						return {
							success: status,
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
		}
	})
});
export default schema