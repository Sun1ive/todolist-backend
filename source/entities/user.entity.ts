import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({ nullable: false, unique: true })
	public email: string;

	@Column({ nullable: true })
	public username: string;

	@Column({ nullable: false, unique: true })
	public password: string;
}
