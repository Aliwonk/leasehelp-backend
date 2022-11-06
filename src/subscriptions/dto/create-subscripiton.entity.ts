import { User } from 'src/users/entities/user.entity';

export class CreateSubscriptionDto {
  start: Date;
  end: Date;
  amount: number;
  user: User;
}
