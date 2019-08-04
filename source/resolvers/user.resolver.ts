import { getConnection } from 'typeorm';
import { IBaseResolvers } from './todo.resolver';
import { User } from '../entities/user.entity';

export const userResolvers: IBaseResolvers = {
	Query: {
		getUser: async (root, args, context, info): Promise<User | void> => {
			console.log({
				root,
				args,
				context,
				info,
			});

			const user = await getConnection()
				.getRepository(User)
				.createQueryBuilder('user')
				.where('user.id = :id', { id: args.id })
				.getOne();

			return user;
		},
	},
};
