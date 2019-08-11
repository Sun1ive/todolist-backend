import { createConnection, Connection, useContainer } from 'typeorm';
import { Config } from '../config/config';
import { User } from '../entities/user.entity';
import { Todo } from '../entities/todo.entity';
import Container from 'typedi';

const isProd = process.env.NODE_ENV === 'production';

export const initDB = async (): Promise<Connection> => {
	useContainer(Container);

	const connection = await createConnection({
		type: 'postgres',
		database: Config.databaseOptions.name,
		password: Config.databaseOptions.password,
		username: Config.databaseOptions.user,
		synchronize: true,
		logging: !isProd,
		entities: [User, Todo],
	});

	return connection;
};
