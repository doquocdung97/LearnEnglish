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
import { TranslateSchema } from './schema';
import TranslateRepository from '../../repository/Translate';
const translaterepo = new TranslateRepository()
// Create the GraphQL schema
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			translate: {
				args:{
					word:{
						type:GraphQLString
					}
				},
				type: TranslateSchema,
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						return translaterepo.audioAndText(args.word)
					} catch (error) {
						console.error(error)
					}
				},
			}
		}
	}),
});
export default schema