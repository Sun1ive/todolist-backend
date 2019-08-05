import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	Index,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Index()
	@Column({ nullable: true, type: 'text' })
	public title: string;

	@Column({ nullable: true, type: 'boolean' })
	public completed: boolean;

	@ManyToOne(() => User, (user) => user.id, {
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	})
	public user: User;
}
