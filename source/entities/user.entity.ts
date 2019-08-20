import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Field, ObjectType, ID } from 'type-graphql';
import { Todo } from './todo.entity';
import { IsNotEmpty, MaxLength, IsEmail } from 'class-validator';

/**
 * @export
 * @class User
 * @extends {BaseEntity}
 */
@Entity({ name: 'user' })
@ObjectType()
export class User extends BaseEntity {
	/**
	 * @type {string}
	 * @memberof User
	 */
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	public id: string;

	/**
	 * @type {string}
	 * @memberof User
	 */
	@Index()
	@Field()
	@Column({ nullable: false, unique: true })
	@IsNotEmpty()
	@IsEmail()
	public email: string;

	/**
	 * @type {string}
	 * @memberof User
	 */
	@Column({ nullable: true })
	@Field({ nullable: true })
	@MaxLength(100)
	public username?: string;

	/**
	 * @type {string}
	 * @memberof User
	 */
	@Column({ nullable: false, unique: false })
	@Field()
	@IsNotEmpty()
	public password: string;

	/**
	 * @type {string}
	 * @memberof User
	 */
	@Index()
	@Column({ nullable: true, unique: false })
	@Field({ nullable: true })
	public token?: string;

	/**
	 * @type {Todo[]}
	 * @memberof User
	 */
	@OneToMany(() => Todo, (todo) => todo.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@Field(() => [Todo])
	public todos: Todo[];
}
