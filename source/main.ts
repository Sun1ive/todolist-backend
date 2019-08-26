import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import express from 'express';
import id from 'nanoid';
import cors from 'cors';
import compression from 'compression';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { Config } from './config/config';
import { initDB } from './database/connection';
import { GraphQLError } from 'graphql';
import { buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/user/user.resolver';
import { Container } from 'typedi';
import { TodoResolver } from './resolvers/todo/todo.resolver';
import { resolve, join } from 'path';
import { writeFile } from 'fs';

const logsPath = resolve(join(__dirname, '..', 'logs'));

(async () => {
	await initDB();

	try {
		const app = express();
		console.log(logsPath);

		app.use(compression());
		app.use(cors());

		app.use('/logs', express.static(logsPath));

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
				const errId = id();

				const errData = [
					{
						message: error.message,
						extensions: error.extensions,
						stack: error.stack,
					},
				];

				writeFile(`${logsPath}/${errId}.json`, JSON.stringify(errData), (err) => {
					if (err) {
						console.log('Error in writing ', err);
					}
					console.log('written');
				});
				return new ApolloError(`Internal Server Error with id ${errId}`);
			},
			playground: true,
		});

		server.applyMiddleware({ app, cors: true });

		app.listen({ port: Config.serverOptions.PORT }, () => {
			console.log(`🚀 Server ready at ${Config.serverOptions.PORT}`);
		});
	} catch (error) {
		console.log('Error in generation %j ', error);
	}
})();
