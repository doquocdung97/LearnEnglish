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
import { User, UserToken } from './schema';
import UserRepository from '../../repository/User';

// Create the GraphQL schema
const userrepo = new UserRepository()
const schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			user: {
				type: User,
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						return context.user;
					} catch (error) {
						console.error(error)
					}
				},
			}
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {
			login: {
				type: UserToken,
				args: {
					identifier: {
						type: new GraphQLNonNull(GraphQLString)
					},
					password: {
						type: new GraphQLNonNull(GraphQLString)
					}
				},
				resolve: async (source: any, args: any, context: any, info: any) => {
					try {
						return await userrepo.login(args.identifier, args.password)
					} catch (error) {
						console.error(error)
					}
				}
			}
		}
	})
});
export default schema