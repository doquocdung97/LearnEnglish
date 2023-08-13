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

const User = new GraphQLObjectType({
	name: 'User',
	fields: {
		id: {
			type: GraphQLString,
		},
		name: {
			type: GraphQLString,
		},
		email: {
			type: GraphQLString,
		},
		phone: {
			type: GraphQLString,
		},
	},
});
const UserToken = new GraphQLObjectType({
	name: 'UserToken',
	fields: {
		token: {
			type: GraphQLString,
		},
		user: {
			type: User
		}
	},
});
export {User,UserToken}