import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  private readonly saltBcrypt = 10;
  private readonly relations: FindOptionsRelations<User> = {
    subscription: true,
  };
  private checkDataForEmpty(data: CreateUserDto): boolean {
    const keys = ['firstName', 'lastName', 'phone', 'email', 'password'];
    for (let i = 0; i < keys.length; i++) {
      const element = data.hasOwnProperty(keys[i]);
      if (!element) return false;
    }
    return true;
  }

  async hashPassword(password: string): Promise<string> {
    const genSalt = bcrypt.genSaltSync(this.saltBcrypt);
    const hashPassword = bcrypt.hashSync(password, genSalt);
    return hashPassword;
  }

  async comparePassword(userPass: string, hashPass: string): Promise<boolean> {
    const passwordEquals = bcrypt.compareSync(userPass, hashPass);
    return passwordEquals;
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const hashPass = await this.hashPassword(userData.password);
    // save user in db
    const user = await this.usersRepository.save({
      ...userData,
      password: hashPass,
    });
    return await this.getUserById(user.id);
  }

  async updateUser(id: number, userData: CreateUserDto): Promise<User> {
    const hashPass = await this.hashPassword(userData.password);
    delete userData.password;
    const updateUser = await this.usersRepository.save({
      id: id,
      ...userData,
      password: hashPass,
    });
    return updateUser;
  }

  async getUserById(id: number): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { id },
      relations: this.relations,
    });
    delete user.password;
    return user;
  }

  async getUserByPhone(phone: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { phone },
      relations: this.relations,
    });
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { email },
      relations: this.relations,
    });
    return user;
  }

  async getAllUser(): Promise<User[]> {
    const users: User[] = await this.usersRepository.find({
      relations: this.relations,
    });
    return users;
  }
}
