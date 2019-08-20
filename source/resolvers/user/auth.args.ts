import { InputType, Field } from 'type-graphql';
import { IsEmail, Length, IsNotEmpty } from 'class-validator';

/**
 * @export
 * @class AuthArgs
 */
@InputType()
export class AuthArgs {
	/**
	 * @type {string}
	 * @memberof AuthArgs
	 */
	@Field()
	@Length(5, 25)
	@IsEmail()
	public email: string;

	/**
	 * @type {string}
	 * @memberof AuthArgs
	 */
	@Field({ nullable: true })
	@Length(3, 20)
	public username?: string;

	/**
	 * @type {string}
	 * @memberof AuthArgs
	 */
	@Field()
	public password: string;
}

/**
 * @export
 * @class MeArgs
 */
@InputType()
export class MeArgs {
	/**
	 * @type {string}
	 * @memberof MeArgs
	 */
	@Field()
	@IsNotEmpty()
	public token: string;
}
