import { Resolver, Mutation, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApolloError } from 'apollo-server-core';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { Todo } from '../../entities/todo.entity';
import { AddTodoArgs } from './todo.args';
import { decodeToken, validateToken } from '../../utils/jwt';

@Resolver(() => Todo)
export class TodoResolver {
	public constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		@InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
	) {}

	@Mutation(() => Todo)
	public async AddTodo(@Arg('data') { completed, title, token }: AddTodoArgs): Promise<Todo> {
		try {
			console.log({ title, token, completed });

			const decoded = decodeToken(token);
			if (!decoded) {
				throw new ApolloError('Invalid token', '403');
			}

			if (!validateToken(token)) {
				throw new ApolloError('Token has been expired', '401');
			}

			console.log(decoded);

			const { id } = decoded as { id: string };
			console.log(id);
			const todo = new Todo();
			todo.title = title;
			todo.completed = completed;
			todo.user = Object.assign({}, todo.user, { id });

			await this.todoRepository
				.createQueryBuilder('todo')
				.insert()
				.into(Todo)
				.values(todo)
				.execute();

			return todo;
		} catch (error) {
			throw new ApolloError(`Error in addTodo mutation ${error.message}`, '403');
		}
	}
}
