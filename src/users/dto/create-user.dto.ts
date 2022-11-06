import { Subscriptions } from 'src/subscriptions/entities/subscriptions.entity';

export class CreateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  password?: string;
  subscription?: Subscriptions;
}
