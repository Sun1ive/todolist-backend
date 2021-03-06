import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApolloError } from 'apollo-server-core';
import { User } from '../../entities/user.entity';
import { getConnection, Repository } from 'typeorm';
import { AuthArgs, MeArgs } from './auth.args';
import { hashPassword, comparePasswords } from '../../utils/bcrypt';
import { generateToken } from '../../utils/jwt';
import { IUpdateUserParams } from '../../interfaces/user.interface';
import { Todo } from '../../entities/todo.entity';

/**
 * @export
 * @class UserResolver
 */
@Resolver(() => User)
export class UserResolver {
	public constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
	) {}

	/**
	 * @param {MeArgs} { token }
	 * @returns {Promise<User>}
	 * @memberof UserResolver
	 */
	@Query(() => User)
	public async me(@Arg('data') { token }: MeArgs): Promise<User> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.token = :token', { token })
			.getOne();

		if (!user) {
			throw new ApolloError('User was not found', '404');
		}

		return user;
	}

	/**
	 * @param {User} { id }
	 * @returns {Promise<Todo[]>}
	 * @memberof UserResolver
	 */
	@FieldResolver()
	public async todos(@Root() { id }: User): Promise<Todo[]> {
		const todos = await this.todoRepository
			.createQueryBuilder('todo')
			.innerJoin('todo.user', 'user')
			.where('user.id = :id', { id })
			.getMany();

		return todos || [];
	}

	/**
	 * @param {AuthArgs} { email, password }
	 * @returns {Promise<User>}
	 * @memberof UserResolver
	 */
	@Mutation(() => User)
	public async Login(@Arg('data') { email, password }: AuthArgs): Promise<User> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('email = :email', { email })
			.getOne();

		if (!user) {
			throw new ApolloError('User was not found', '404');
		}

		if (!(await comparePasswords(password, user.password))) {
			throw new ApolloError('Password is incorrect', '403');
		}

		const token = generateToken({ email, id: user.id });

		await this.updateUser({ email, token });

		return Object.assign({}, user, { token });
	}

	/**
	 * @param {AuthArgs} { email, username, password }
	 * @returns {Promise<User>}
	 * @memberof UserResolver
	 */
	@Mutation(() => User)
	public async Register(@Arg('data') { email, username, password }: AuthArgs): Promise<User> {
		console.log({ email, username, password });
		const user = new User();
		user.email = email;
		user.username = username;
		user.password = await hashPassword(password);

		const insertResult = await this.userRepository
			.createQueryBuilder('user')
			.insert()
			.into(User)
			.values(user)
			.execute();

		const userId = insertResult.raw[0].id;
		const token = generateToken({ email, id: userId });

		await this.updateUser({
			email,
			token,
		});

		return Object.assign({}, user, { token });
	}

	/**
	 * @private
	 * @memberof UserResolver
	 */
	private readonly updateUser = async ({ email, ...data }: IUpdateUserParams): Promise<void> => {
		try {
			await getConnection()
				.getRepository(User)
				.createQueryBuilder('user')
				.update()
				.set(data)
				.where('email = :email', { email })
				.execute();
		} catch (error) {
			console.log('Error in update user ', error);
		}
	};
}
