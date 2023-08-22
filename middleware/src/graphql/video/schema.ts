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