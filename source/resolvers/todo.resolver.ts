import { getConnection } from 'typeorm';
import { Todo } from '../entities/todo.entity';

export interface IBaseResolvers {
	[key: string]: {
		[key: string]: (
			root: unknown | undefined,
			args: any,
			context: any,
			info: any,
		) => Promise<any>;
	};
}

export const todoResolvers: IBaseResolvers = {
	Query: {
		getTodos: async (root, args, context, info): Promise<Todo[]> => {
			console.log({
				root,
				args,
				context,
				info,
			});

			const todos = await getConnection()
				.getRepository(Todo)
				.createQueryBuilder('todos')
				.innerJoinAndSelect('todos.user', 'user')
				.getMany();

			return todos;
		},
	},
};
