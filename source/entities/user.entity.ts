import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { Todo } from './todo.entity';
import { IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

@Entity({ name: 'user' })
@ObjectType()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	public id: string;

	@Index()
	@Field()
	@Column({ nullable: false, unique: true })
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	@Column({ nullable: true })
	@Field({ nullable: true })
	@MaxLength(100)
	public username?: string;

	@Column({ nullable: false, unique: false })
	@Field()
	@IsNotEmpty()
	public password: string;

	@Index()
	@Column({ nullable: true, unique: false })
	@Field({ nullable: true })
	public token?: string;

	@OneToMany(() => Todo, (todo) => todo.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@Field(() => [Todo])
	public todos: Todo[];
}
