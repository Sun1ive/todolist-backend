import { InputType, Field, ID } from 'type-graphql';
import { IsNotEmpty, IsBoolean, IsString } from 'class-validator';

/**
 * @export
 * @class AddTodoArgs
 */
@InputType()
export class AddTodoArgs {
	/**
	 * @type {string}
	 * @memberof AddTodoArgs
	 */
	@Field()
	@IsNotEmpty()
	@IsString()
	public token: string;

	/**
	 * @type {string}
	 * @memberof AddTodoArgs
	 */
	@Field()
	@IsNotEmpty()
	@IsString()
	public title: string;

	/**
	 * @type {boolean}
	 * @memberof AddTodoArgs
	 */
	@Field()
	@IsNotEmpty()
	@IsBoolean()
	public completed: boolean;
}

/**
 * @export
 * @class UpdateTodoArgs
 */
@InputType()
export class UpdateTodoArgs {
	/**
	 * @type {string}
	 * @memberof UpdateTodoArgs
	 */
	@Field(() => ID)
	@IsNotEmpty()
	public id: string;

	/**
	 * @type {string}
	 * @memberof UpdateTodoArgs
	 */
	@Field({ nullable: true })
	public title?: string;

	/**
	 * @type {boolean}
	 * @memberof UpdateTodoArgs
	 */
	@Field({ nullable: true })
	public completed?: boolean;
}

@InputType()
export class DeleteTodoArgs {
	/**
	 * @type {string}
	 * @memberof DeleteTodoArgs
	 */
	@Field(() => ID)
	public todoId: string;

	/**
	 * @type {string}
	 * @memberof DeleteTodoArgs
	 */
	@Field()
	@IsString()
	@IsNotEmpty()
	public token: string;
}
