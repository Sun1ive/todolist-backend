import { getConnection } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { IBaseResolvers } from './todo.resolver';
import { User } from '../entities/user.entity';
import { generateToken } from '../utils/jwt';
import { ApolloError } from 'apollo-server';
import { IGetUserTodosResponse } from '../interfaces/user.interface';

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

		getUserTodos: async (_, { id }): Promise<IGetUserTodosResponse> => {
			try {
				const todos = await getConnection()
					.getRepository(User)
					.createQueryBuilder('user')
					.innerJoinAndSelect('user.todos', 'todo')
					.where('user.id = :id', { id })
					.getOne();

				if (!todos) {
					throw new ApolloError('User with this id was not found');
				}

				const user = {
					username: todos.username,
					email: todos.email,
					id: todos.id,
					token: todos.token,
					todos: todos.todos,
				};

				return user;
			} catch (error) {
				console.log(error);
				throw new ApolloError(error);
			}
		},
	},

	Mutation: {
		signUp: async (_, { params: { email, username, password } }): Promise<User> => {
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

				await getConnection()
					.createQueryBuilder()
					.update(User)
					.set({
						token,
					})
					.where('id = :id', { id: newUser.id })
					.execute();

				return Object.assign({}, newUser, { token });
			} catch (error) {
				throw new ApolloError(error);
			}
		},

		signIn: async (_, { params: { email, password } }): Promise<User> => {
			const userRepo = getConnection().getRepository(User);

			try {
				const user = await userRepo.findOne({
					where: {
						email,
					},
				});

				if (!user || !(await compare(password, user.password))) {
					throw new ApolloError('Password or email are invalid');
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
				throw new ApolloError(error);
			}
		},
	},
};
