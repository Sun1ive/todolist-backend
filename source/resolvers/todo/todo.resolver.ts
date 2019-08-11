import { Resolver, Mutation, Arg } from 'type-graphql';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ApolloError } from 'apollo-server-core';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { Todo } from '../../entities/todo.entity';
import { AddTodoArgs, UpdateTodoArgs, DeleteTodoArgs } from './todo.args';
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
			const decoded = decodeToken(token);
			if (!decoded) {
				throw new ApolloError('Invalid token', '403');
			}

			if (!validateToken(token)) {
				throw new ApolloError('Token has been expired', '401');
			}

			const { id } = decoded as { id: string };
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
			throw new ApolloError(`Error in addTodo mutation ${error.message}`, '500');
		}
	}

	@Mutation(() => Todo)
	public async UpdateTodo(@Arg('data') { id, ...rest }: UpdateTodoArgs): Promise<Todo> {
		try {
			await this.todoRepository.update({ id }, rest);
			const todo = await this.todoRepository.findOne({ id });

			return todo as Todo;
		} catch (error) {
			console.log('Error in update ', error);

			throw new ApolloError(`Error in UpdateTodo ${error.message}`, '500');
		}
	}

	@Mutation(() => Boolean)
	public async DeleteTodo(@Arg('data') { token, todoId }: DeleteTodoArgs): Promise<boolean> {
		try {
			const decoded = decodeToken(token);
			if (!decoded) {
				throw new ApolloError('Invalid token', '403');
			}

			if (!validateToken(token)) {
				throw new ApolloError('Token has been expired', '401');
			}

			const { id } = decoded as { id: string };

			const user = await this.userRepository
				.createQueryBuilder('user')
				.innerJoinAndSelect('user.todos', 'todos')
				.where('user.id = :id', { id })
				.getOne();

			if (!user || user.todos.map((todo) => todo.id).indexOf(todoId) === -1) {
				throw new ApolloError(`This todo does not exists`, '401');
			}

			await this.todoRepository.delete({
				id: todoId,
			});

			return true;
		} catch (error) {
			throw new ApolloError(`Error in DeleteTodo ${error.message}`, '500');
		}
	}
}
