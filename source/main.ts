import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Config } from './config/config';
import { ApolloServer } from 'apollo-server';
import { initDB } from './database/connection';
import { GraphQLError } from 'graphql';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user/user.resolver';
import { getConnection } from 'typeorm';
import { User } from './entities/user.entity';
import { Container } from 'typedi';

(async () => {
	await initDB();
	await getConnection()
		.getRepository(User)
		.delete({});

	try {
		const schema = await buildSchema({
			resolvers: [UserResolver],
			container: Container,
		});

		const server = new ApolloServer({
			schema,
			formatError: (error: GraphQLError) => {
				return error;
			},
			playground: true,
			introspection: true,
			cors: false,
			debug: true,
		});

		server.listen({ port: Config.serverOptions.PORT }).then(({ url }) => {
			console.log(`🚀  Server ready at ${url}`);
		});
	} catch (error) {
		console.log('Error in generation %j ', error);
	}
})();
