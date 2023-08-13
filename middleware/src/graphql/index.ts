import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import schemaUser from './user';
import schemaVideo from './video';
import schemaDictionary from './dictionary';
import schemaTranslate from './translate';
import { mergeSchemas } from '@graphql-tools/schema';
import { Variables } from '../constants';
import { GraphQLError } from 'graphql';
import UserRepository from '../repository/User';
async function apolloServer(app) {
	const server = new ApolloServer({
		schema: mergeSchemas({
			schemas: [schemaUser, schemaVideo, schemaDictionary,schemaTranslate]
		}),
		plugins: [
			ApolloServerPluginLandingPageLocalDefault({
				embed: true,
			}),
		],
		context: async ({ req }) => {
			// throw new GraphQLError('User is not authenticated', {
			//   extensions: {
			//     code: 'UNAUTHENTICATED',
			//     http: { status: 401 },
			//   },
			// });
			const userrepo = new UserRepository()
			const user = await userrepo.getUserByToken(req.headers.authorization)
			req.user = user
			return req
		},
	});
	await server.start()
	server.applyMiddleware({ app, path: Variables.ENDPOINT_GRAPHQL_V1 });
	// var logger = new LoggerHelper('Main')
	return server
}
export default apolloServer