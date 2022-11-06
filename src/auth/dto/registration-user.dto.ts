import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class RegistrationUserDto extends CreateUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}
