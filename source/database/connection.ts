import { createConnection, Connection, useContainer } from 'typeorm';
import Container from 'typedi';
import { Config } from '../config/config';
import { User } from '../entities/user.entity';
import { Todo } from '../entities/todo.entity';

const isProd = process.env.NODE_ENV === 'production';

export const initDB = async (): Promise<Connection> => {
	useContainer(Container);
	const baseOptions = {
		database: Config.databaseOptions.name,
		password: Config.databaseOptions.password,
		username: Config.databaseOptions.user,
		host: Config.databaseOptions.host,
		synchronize: true,
		logging: !isProd,
		entities: [User, Todo],
	};

	const connection = await createConnection({
		type: 'postgres',
		...baseOptions,
	});

	return connection;
};
