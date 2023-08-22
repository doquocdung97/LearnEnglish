import {
	GraphQLObjectType,
	GraphQLString,
} from 'graphql';

export const TranslateSchema = new GraphQLObjectType({
	name: 'Translate',
	fields: {
		text: {
			type: GraphQLString,
		},
		audio: {
			type: GraphQLString,
			resolve: async (source: any, args: any, context: any, info: any) => {
				return `${context.headers.origin}${source.audio}`
			}
		}
	},
});