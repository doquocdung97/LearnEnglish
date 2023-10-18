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
import DictionaryRepository from '../../repository/Dictionary';
const natural = require('natural');

const translaterepo = new TranslateRepository()
const dictionaryrepo = new DictionaryRepository()
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
		},
		exercise: {
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
		phonetic: {
			type: PhoneticSchema,
		},
		meanings: {
			type: new GraphQLList(MeaningSchema),
		},
	},
});
export const MyDictionarySchema = new GraphQLObjectType({
	name: 'MyDictionary',
	fields: {
		id: {
			type: GraphQLInt,
		},
		level: {
			type: GraphQLInt,
		},
		word: {
			type: GraphQLString,
		},
		start: {
			type: GraphQLFloat,
		},
		dur: {
			type: GraphQLFloat,
		},
		detail: {
			type: DictionarySchema,
			resolve: async (source: any, args: any, context: any, info: any) => {
				if (source.word) {
					const dictionarys = await dictionaryrepo.getWord(source.word)
					const toword = natural.PorterStemmer.stem(source.word)
					var tokenizer = new natural.WordTokenizer();
					dictionarys.map(item=>{
						item.meanings.map(i=>{
							i.definitions.map(j=>{
								const words = tokenizer.tokenize(j.example)
								words.map(word=>{
									
									if(natural.PorterStemmer.stem(word)==toword){
										// console.log(j.example,word,toword)
										j.exercise = j.example.replace(word,".........")
									}
								})
								// console.log(words,toword)
							})
						})
					})
					return dictionarys.length > 0 ? dictionarys[0] : null
				}
				return
			}
		}
	},
});