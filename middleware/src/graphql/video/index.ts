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
import { VideoSchema ,PaginationTokenVideosResult, PlayListSchema} from './schema';
import { PaginationInputSchema, PaginationTokenInputSchema, ResultBase, createResultPagination, createResultPaginationToken } from '../common';
import VideoRepository from '../../repository/Video';
import { PaginationInput } from '../../model/common';

// Create the GraphQL schema
const videorepo = new VideoRepository()
const PaginationTokenVideosPlayListResult = createResultPaginationToken('VideosPlayList', VideoSchema,{
	title:{
		type:GraphQLString
	}
})
const PaginationVideosResult = createResultPagination('Videos', VideoSchema)
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			videos: {
				type: PaginationVideosResult,
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const videos = await videorepo.globleVideos();
						return {
							total: videos.length,
							data: videos
						};
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
						const userId = context.user?.id
						return await videorepo.get(userId, args.id, context.headers.lang)
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
			search:{
				type: PaginationTokenVideosResult,
				args:{
					text:{
						type:new GraphQLNonNull(GraphQLString)
					},
					pagination:{
						type:PaginationTokenInputSchema
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const pagination = PaginationInput.parse(args.pagination)
						return await videorepo.search(args.text,pagination)
					} catch (error) {
						console.error(error)
					}
					return null
				},
			},
			youtubeByChannel:{
				type: PaginationTokenVideosResult,
				args:{
					channelId:{
						type:new GraphQLNonNull(GraphQLString)
					},
					pagination:{
						type:PaginationTokenInputSchema
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						const pagination = PaginationInput.parse(args.pagination)
						return await videorepo.videoByChannel(args.channelId,pagination)
					} catch (error) {
						console.error(error)
					}
					return null
				},
			},
			playList:{
				type: PlayListSchema,
				args:{
					playlistId:{
						type:new GraphQLNonNull(GraphQLString)
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						// const pagination = PaginationInput.parse(args.pagination)
						return await videorepo.playList(args.playlistId)
					} catch (error) {
						console.error(error)
					}
					return null
				},
			},
			playLists:{
				// type: PaginationTokenVideosPlayListResult,
				type: new GraphQLList(PlayListSchema),
				// args:{
				// 	playlistId:{
				// 		type:new GraphQLNonNull(GraphQLString)
				// 	},
				// 	pagination:{
				// 		type:PaginationTokenInputSchema
				// 	}
				// },
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						// const pagination = PaginationInput.parse(args.pagination)
						return await videorepo.playList()
					} catch (error) {
						console.error(error)
					}
					return null
				},
			}
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
						if (context.user) {
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
						} else {
							return {
								success: false,
								code: 3
							};
						}

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
						if (context.user) {
							const status = await videorepo.deleteMyVideo(context.user.id, args.videoId);
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
						} else {
							return {
								success: false,
								code: 3
							};
						}

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