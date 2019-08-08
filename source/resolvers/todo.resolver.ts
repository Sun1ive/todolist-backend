import { getConnection } from 'typeorm';
import { Todo } from '../entities/todo.entity';

export interface IBaseResolvers {
	[key: string]: {
		[key: string]: (root: unknown | undefined, args: any, context: any, info: any) => Promise<any>;
	};
}

export const todoResolvers: IBaseResolvers = {
	Query: {
		getTodos: async (): Promise<Todo[]> => {
			const todos = await getConnection()
				.getRepository(Todo)
				.createQueryBuilder('todos')
				.innerJoinAndSelect('todos.user', 'user')
				.getMany();

			return todos;
		},
	},
	Mutation: {
		addTodo: async (_, { params: { title, completed, userId } }): Promise<Todo> => {
			await getConnection()
				.createQueryBuilder()
				.insert()
				.into(Todo)
				.values([
					{
						title,
						completed,
						user: userId,
					},
				])
				.execute();

			const todo = await getConnection()
				.getRepository(Todo)
				.createQueryBuilder('todo')
				.innerJoinAndSelect('todo.user', 'user')
				.where('user.id = :id', { id: userId })
				.getOne();

			return todo as Todo;
		},

		updateTodo: async (_, { params: { todoId, title, completed } }): Promise<Todo> => {
			await getConnection()
				.getRepository(Todo)
				.createQueryBuilder('todo')
				.update()
				.set({
					completed,
					title,
					id: todoId,
				})
				.where('todo.id = :id', { id: todoId })
				.execute();

			const todo = (await getConnection()
				.getRepository(Todo)
				.createQueryBuilder('todo')
				.innerJoinAndSelect('todo.user', 'user')
				.where('todo.id = :id', { id: todoId })
				.getOne()) as Todo;

			return todo;
		},

		deleteTodo: async (_, { id }): Promise<boolean> => {
			try {
				await getConnection()
					.getRepository(Todo)
					.createQueryBuilder('todo')
					.delete()
					.where('todo.id = :id', { id })
					.execute();

				return true;
			} catch (error) {
				return false;
			}
		},
	},
};
