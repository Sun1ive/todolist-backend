import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty } from 'class-validator';
import { ObjectType, Field, ID } from 'type-graphql';

/**
 * @export
 * @class Todo
 * @extends {BaseEntity}
 */
@Entity()
@ObjectType()
export class Todo extends BaseEntity {
	/**
	 * @type {string}
	 * @memberof Todo
	 */
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	public id: string;

	/**
	 * @type {string}
	 * @memberof Todo
	 */
	@Index()
	@Column({ nullable: true, type: 'text' })
	@IsNotEmpty()
	@Field()
	public title: string;

	/**
	 * @type {boolean}
	 * @memberof Todo
	 */
	@Index()
	@Column({ nullable: true, type: 'boolean', default: false })
	@Field()
	public completed?: boolean;

	/**
	 * @type {User}
	 * @memberof Todo
	 */
	@ManyToOne(() => User, (user) => user.todos, { cascade: true, onDelete: 'CASCADE' })
	@JoinTable()
	@Field(() => User)
	public user: User;
}
