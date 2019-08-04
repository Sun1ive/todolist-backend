import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
} from 'typeorm';
import { Todo } from './todo.entity';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ nullable: false, unique: true })
	public email: string;

	@Column({ nullable: true })
	public username: string;

	@Column({ nullable: false, unique: false })
	public password: string;

	@OneToMany(() => Todo, (todo) => todo.id)
	public todo: Todo;
}
