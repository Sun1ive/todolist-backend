import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, Index, JoinTable } from 'typeorm';
import { User } from './user.entity';
import { IsNotEmpty } from 'class-validator';
import { ObjectType, Field, ID } from 'type-graphql';

@Entity()
@ObjectType()
export class Todo extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	@Field(() => ID)
	public id: string;

	@Index()
	@Column({ nullable: true, type: 'text' })
	@IsNotEmpty()
	@Field()
	public title: string;

	@Index()
	@Column({ nullable: true, type: 'boolean', default: false })
	@Field()
	public completed?: boolean;

	@ManyToOne(() => User, (user) => user.todos, { cascade: true, onDelete: 'CASCADE' })
	@JoinTable()
	@Field(() => User)
	public user: User;
}
