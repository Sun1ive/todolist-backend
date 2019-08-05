interface IConfig {
	databaseOptions: {
		name: string;
		password: string;
		user: string;
	};

	serverOptions: {
		PORT: number | string;
	};

	common: {
		JWT_SECRET: string;
	};
}

export const Config: IConfig = {
	databaseOptions: {
		name: process.env.DB_NAME || 'todos',
		password: process.env.DB_PASSWORD || 'postgres',
		user: process.env.DB_USER || 'postgres',
	},

	serverOptions: {
		PORT: process.env.SERVER_PORT || 3344,
	},

	common: {
		JWT_SECRET: process.env.JWT_SECRET || 'SECRET',
	},
};
