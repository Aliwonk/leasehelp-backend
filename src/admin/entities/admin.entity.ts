import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin')
export class Admin extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  login: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'text' })
  role: string;
}
