import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('subscriptions')
export class Subscriptions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  start: Date;

  @Column({ type: 'date' })
  end: Date;

  @Column({ type: 'int' })
  amount: number;

  @OneToOne(() => User, (user) => user.subscription)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
