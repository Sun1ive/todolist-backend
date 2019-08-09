import { Todo } from '../entities/todo.entity';

export interface IGetUserTodosResponse {
	username?: string;
	id: string;
	email: string;
	token?: string;
	todos: Todo[];
}
