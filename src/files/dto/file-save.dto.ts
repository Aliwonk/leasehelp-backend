import { User } from 'src/users/entities/user.entity';

export default class SaveFileDto {
  name: string;
  path: string;
  size: number;
  user: User;
}
