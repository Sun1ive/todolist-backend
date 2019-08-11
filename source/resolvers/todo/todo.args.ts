import { InputType, Field, ID } from 'type-graphql';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

@InputType()
export class AddTodoArgs {
	@Field()
	@IsNotEmpty()
	@IsString()
	public token: string;

	@Field()
	@IsNotEmpty()
	@IsString()
	public title: string;

	@Field()
	@IsNotEmpty()
	@IsBoolean()
	public completed: boolean;
}

@InputType()
export class UpdateTodoArgs {
	@Field(() => ID)
	@IsNotEmpty()
	public id: string;

	@Field({ nullable: true })
	public title?: string;

	@Field({ nullable: true })
	public completed?: boolean;
}

@InputType()
export class DeleteTodoArgs {
	@Field(() => ID)
	public todoId: string;

	@Field()
	@IsString()
	@IsNotEmpty()
	public token: string;
}
