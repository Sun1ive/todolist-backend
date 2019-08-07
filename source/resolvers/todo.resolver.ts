import { getConnection } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';

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
			const todoRepo = getConnection().getRepository(Todo);

			console.log({ title, completed, userId });

			const todo = await todoRepo.save(
				todoRepo.create({
					title,
					completed,
					user: {
						id: userId,
					},
				}),
			);

			return todo;
		},

		// updateTodo: async (_, { todoId, title, completed }): Promise<Todo> => {},
	},
};
