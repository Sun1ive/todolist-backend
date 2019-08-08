import { getConnection } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { IBaseResolvers } from './todo.resolver';
import { User } from '../entities/user.entity';
import { generateToken } from '../utils/jwt';
import { ApolloError } from 'apollo-server';

export const userResolvers: IBaseResolvers = {
	Query: {
		getUser: async (_, { id }): Promise<User | void> => {
			const user = await getConnection()
				.getRepository(User)
				.createQueryBuilder('user')
				.where('user.id = :id', { id })
				.getOne();

			return user;
		},
	},

	Mutation: {
		signUp: async (_, { params: { email, username, password } }): Promise<User | ApolloError> => {
			const userRepo = getConnection().getRepository(User);

			try {
				const newUser = await userRepo.save(
					userRepo.create({
						email,
						username,
						password: await hash(password, 10),
					}),
				);
				const token = generateToken({ id: newUser.id, email });

				await userRepo.update({ id: newUser.id }, { token });

				return Object.assign({}, newUser, { token });
			} catch (error) {
				return new ApolloError(error);
			}
		},

		signIn: async (_, { params: { email, password } }): Promise<User | ApolloError> => {
			const userRepo = getConnection().getRepository(User);

			try {
				const user = await userRepo.findOne({
					where: {
						email,
					},
				});

				if (!user || !(await compare(password, user.password))) {
					return new ApolloError('Password or email are invalid');
				}

				const token = generateToken({ id: user.id, email });

				await userRepo.update(
					{
						id: user.id,
					},
					{
						token,
					},
				);

				return Object.assign({}, user, { token });
			} catch (error) {
				return new ApolloError(error);
			}
		},
	},
};
