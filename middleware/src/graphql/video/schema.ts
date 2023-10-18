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
import { User } from '../user/schema';
import VideoRepository from '../../repository/Video';
import { PaginationTokenInputSchema, createResultPaginationToken } from '../common';
import { PaginationInput } from '../../model/common';

const SubtitleSchema = new GraphQLObjectType({
	name: 'Subtitle',
	fields: {
		start: {
			type: GraphQLFloat,
		},
		dur: {
			type: GraphQLFloat,
		},
		text: {
			type: GraphQLString,
			resolve: async (source: any, args: any, context: any, info: any) => {
				// source.text.replace(/<style([\s\S]*?)<\/style>/gi, ' ')
				// .replace(/<script([\s\S]*?)<\/script>/gi, ' ')
				// .replace(/(<(?:.|\n)*?>)/gm, ' ')
				// .replace(/\s+/gm, '-');
				return source.text.replace(/\s+/gm, ' ')
			}
		}
	},
});
export const ThumbnailSchema = new GraphQLObjectType({
	name: 'Thumbnail',
	fields: {
		url: {
			type: GraphQLString,
		},
		width: {
			type: GraphQLInt
		},
		height: {
			type: GraphQLInt
		}
	},
});
const videorepo = new VideoRepository()
export const VideoSchema = new GraphQLObjectType({
	name: 'Video',
	fields: {
		id: {
			type: GraphQLString,
		},
		favorite: {
			type: GraphQLBoolean
		},
		// videoId: {
		// 	type: GraphQLString,
		// },
		title: {
			type: GraphQLString,
		},
		publishedAt: {
			type: GraphQLString,
		},
		subtitles: {
			type: new GraphQLList(SubtitleSchema),
			resolve: async (source: any, args: any, context: any, info: any) => {
				return await videorepo.getSubTitle(source.id)
			},
		},
		thumbnails: {
			type: new GraphQLList(ThumbnailSchema),
		},
		user: {
			type: User
		}
	},
});
export const PaginationTokenVideosResult = createResultPaginationToken('Videos', VideoSchema)
export const PlayListSchema = new GraphQLObjectType({
	name: 'PlayList',
	fields: {
		id: {
			type: GraphQLString,
		},
		title: {
			type: GraphQLString,
		},
		thumbnails: {
			type: new GraphQLList(ThumbnailSchema),
		},
		video: {
			type: PaginationTokenVideosResult,
			args:{
				pagination:{
					type:PaginationTokenInputSchema
				}
			},
			resolve: async (source: any, args: any, context: any, info: any) => {
				const pagination = PaginationInput.parse(args.pagination)
				return await videorepo.videoByPlayList(source.id, pagination)
			},
		}
	},
});