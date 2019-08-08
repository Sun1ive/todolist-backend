import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Index()
	@Column({ nullable: false, unique: true })
	public email: string;

	@Column({ nullable: true })
	public username: string;

	@Column({ nullable: false, unique: false })
	public password: string;

	@Index()
	@Column({ nullable: true, unique: false })
	public token: string;

	@OneToMany(() => Todo, (todo) => todo.user, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	public todo: Todo;
}
