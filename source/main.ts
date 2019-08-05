import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import nanoid from 'nanoid';
import { Config } from './config/config';
import { Connection } from 'typeorm';
import { ApolloServer, makeExecutableSchema, ApolloError } from 'apollo-server';
import { initDB } from './database/connection';
import { User } from './entities/user.entity';
import { Todo } from './entities/todo.entity';
import { todoResolvers } from './resolvers/todo.resolver';
import { typeDef as TodoDef } from './typedefs/todo.typedef';
import { typeDef as UserDef } from './typedefs/user.typedef';
import { userResolvers } from './resolvers/user.resolver';
import { RootQuery } from './typedefs';
import { GraphQLError } from 'graphql';

async function mock(connection: Connection) {
	const userRepo = await connection.getRepository(User);
	const todoRepo = await connection.getRepository(Todo);
	await userRepo.delete({});
	await todoRepo.delete({});

	// const [user] = await userRepo.save([
	// 	userRepo.create({
	// 		email: 'google@com',
	// 		username: 'bob',
	// 		password: '12345',
	// 	}),
	// 	userRepo.create({
	// 		email: 'google1@com',
	// 		username: 'bob1',
	// 		password: '123456',
	// 	}),
	// ]);
	// await todoRepo.save(
	// 	todoRepo.create({
	// 		completed: false,
	// 		title: 'do something',
	// 		user,
	// 	}),
	// );
}

const schema = makeExecutableSchema({
	typeDefs: [RootQuery, TodoDef, UserDef],
	resolvers: [todoResolvers, userResolvers],
});

const server = new ApolloServer({
	schema,
	context: ({ req }) => {
		const token = req.headers.authorization ? req.headers.authorization : '';

		return {};
	},
	formatError: (error: GraphQLError) => {
		if (error.originalError instanceof ApolloError) {
			return error;
		}

		const errId = nanoid();
		console.log(`Error in request %s`, error.message);
		console.log(JSON.stringify(error, null, 2));

		return new ApolloError(`Internal Server Error: ${errId}`);
	},
});

(async () => {
	const connection = await initDB();

	await mock(connection);

	server.listen({ port: Config.serverOptions.PORT }).then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
})();
