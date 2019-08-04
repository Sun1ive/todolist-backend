import { config as DotenvConfig } from 'dotenv';
DotenvConfig();
import { Config } from './config/config';

import { ApolloServer, gql } from 'apollo-server';
import { initDB } from './database/connection';

const resolvers = {};
const typeDefs = gql`
	type Book {
		title: String
		author: String
	}

	type Query {
		books: [Book]
	}
`;

const server = new ApolloServer({ typeDefs, resolvers });

(async () => {
	const connection = await initDB();

	server.listen({ port: Config.serverOptions.PORT }).then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
})();
