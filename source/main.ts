import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { Config } from './config/config';
import { ApolloServer, makeExecutableSchema, ApolloError } from 'apollo-server';
import { initDB } from './database/connection';
import { todoResolvers } from './resolvers/todo.resolver';
import { userResolvers } from './resolvers/user.resolver';
import { GraphQLError } from 'graphql';
import { importSchema } from 'graphql-import';

const typeDefs = importSchema('./source/typedefs/schema.graphql');

const schema = makeExecutableSchema({
	typeDefs,
	resolvers: [todoResolvers, userResolvers],
});

const server = new ApolloServer({
	schema,
	formatError: (error: GraphQLError) => {
		if (error.originalError instanceof ApolloError) {
			return error;
		}

		return error;
	},
});

(async () => {
	await initDB();

	server.listen({ port: Config.serverOptions.PORT }).then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
})();
