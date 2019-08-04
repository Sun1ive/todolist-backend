import { createConnection, Connection } from 'typeorm';
import { Config } from '../config/config';
import { User } from '../entities/user.entity';

export const initDB = async (): Promise<Connection> => {
	const connection = await createConnection({
		type: 'postgres',
		database: Config.databaseOptions.name,
		password: Config.databaseOptions.password,
		username: Config.databaseOptions.user,
		synchronize: true,
		logging: true,
		cache: true,
		entities: [User],
	});

	return connection;
};
