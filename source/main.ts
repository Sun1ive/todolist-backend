import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Config } from './config/config';
import { ApolloServer } from 'apollo-server';
import { initDB } from './database/connection';
import { GraphQLError } from 'graphql';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user/user.resolver';
import { Container } from 'typedi';
import { TodoResolver } from './resolvers/todo/todo.resolver';

(async () => {
	await initDB();

	try {
		const schema = await buildSchema({
			resolvers: [UserResolver, TodoResolver],
			container: Container,
			emitSchemaFile: true,
		});

		const server = new ApolloServer({
			schema,
			formatResponse: (response: any) => {
				return response;
			},
			formatError: (error: GraphQLError) => {
				return error;
			},
			playground: true,
			introspection: true,
			cors: false,
		});

		server.listen({ port: Config.serverOptions.PORT }).then(({ url }) => {
			console.log(`🚀  Server ready at ${url}`);
		});
	} catch (error) {
		console.log('Error in generation %j ', error);
	}
})();
