import { Files } from 'src/files/entities/files.entity';
import { Subscriptions } from 'src/subscriptions/entities/subscriptions.entity';
import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: true,
    default: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 250,
    unique: true,
    nullable: true,
    default: null,
  })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => Subscriptions, (subscriptions) => subscriptions.user)
  @JoinColumn()
  subscription: Subscriptions;

  @Column({ type: 'varchar', nullable: true, default: 'USER' })
  role: string;

  @OneToMany(() => Files, (files) => files.user)
  files: Files;

  // кп
  // @ManyToMany()

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
