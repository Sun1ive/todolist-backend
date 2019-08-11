import { InputType, Field } from 'type-graphql';
import { IsEmail, Length, IsNotEmpty } from 'class-validator';

@InputType()
export class AuthArgs {
	@Field()
	@Length(5, 25)
	@IsEmail()
	public email: string;

	@Field({ nullable: true })
	@Length(3, 20)
	public username?: string;

	@Field()
	public password: string;
}

@InputType()
export class MeArgs {
	@Field()
	@IsNotEmpty()
	public token: string;
}
