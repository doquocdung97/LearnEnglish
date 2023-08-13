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
import TranslateRepository from '../../repository/Translate';
const translaterepo = new TranslateRepository()
export const PhoneticSchema = new GraphQLObjectType({
	name: 'Phonetic',
	fields: {
		text: {
			type: GraphQLString,
		},
		audio: {
			type: GraphQLString,
		}
	},
});
export const DefinitionSchema = new GraphQLObjectType({
	name: 'Definition',
	fields: {
		definition: {
			type: GraphQLString,
		},
		example: {
			type: GraphQLString,
		}
	},
});

export const MeaningSchema = new GraphQLObjectType({
	name: 'Meaning',
	fields: {
		type: {
			type: GraphQLString,
		},
		definitions: {
			type: new GraphQLList(DefinitionSchema),
		}
	},
});

export const DictionarySchema = new GraphQLObjectType({
	name: 'Dictionary',
	fields: {
		word: {
			type: GraphQLString,
		},
		translate: {
			type: GraphQLString,
			resolve: async (source: any, args: any, context: any, info: any) => {
				return translaterepo.handle(source.word)
			}
		},
		phonetics: {
			type: new GraphQLList(PhoneticSchema),
		},
		meanings: {
			type: new GraphQLList(MeaningSchema),
		},
	},
});