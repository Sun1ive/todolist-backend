import { InputType, Field } from 'type-graphql';
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
