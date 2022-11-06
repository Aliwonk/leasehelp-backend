import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminService } from 'src/admin/admin.service';
import { LoginAdminDto } from 'src/admin/dto/login-admin.dto';
import { Admin } from 'src/admin/entities/admin.entity';
import { Subscriptions } from 'src/subscriptions/entities/subscriptions.entity';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private adminService: AdminService,
    private jwtService: JwtService,
    private subscriptionsService: SubscriptionsService,
  ) {}
  private validateData(
    userData: RegistrationUserDto | LoginUserDto | any,
    method: 'login' | 'register',
  ): string | boolean {
    const email_regexp =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

    if (method === 'login') {
      const emailLogin = userData.login.indexOf('@') !== -1;
      const phoneLogin = userData.login.slice(0, 2) === '+7';

      // check password
      if (userData.password.length < 4) return 'Short password';

      // check phone
      if (phoneLogin) {
        if (userData.login.length < 12 && userData.login.slice(0, 2) !== '+7')
          return 'Incorrect phone';
      }

      // check email
      if (emailLogin) {
        if (!email_regexp.test(userData.login)) return 'Incorrect email';
      }
    } else if (method === 'register') {
      // check password
      if (userData.password.length < 4) return 'Short password';

      // check email
      if (!email_regexp.test(userData.email)) return 'Incorrect email';

      // check phone
      if (userData.phone.slice(0, 2) !== '+7' || userData.phone.length < 12)
        return 'Incorrect phone';
    }

    return true;
  }
  private checkForEmptyData(
    data: RegistrationUserDto,
    method: 'login' | 'register',
  ): boolean | string {
    let keys: Array<keyof RegistrationUserDto | keyof LoginUserDto>;
    if (method === 'register') {
      keys = ['firstName', 'lastName', 'phone', 'email', 'password'];
    } else if (method === 'login') {
      keys = ['login', 'password'];
    }

    const valuesData = Object.values(data);
    for (let i = 0; i < keys.length; i++) {
      // check value object for empty
      if (valuesData[i] === '') return 'Empty value';

      // check exist object
      const element = data.hasOwnProperty(keys[i]);
      if (!element) return 'Missing key object';
    }
    return true;
  }

  private async clearSpace(
    data: RegistrationUserDto | LoginUserDto,
  ): Promise<RegistrationUserDto | LoginUserDto | any> {
    const validObject = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element: any = data[key];
        validObject[key] = element.split(' ').join('');
      }
    }
    return validObject;
  }

  private async generateToken(data: User | Admin | any) {
    const payload = {
      id: data.id,
      phone: data.phone,
      subscriptions: data.subscription || null,
      role: data.role,
    };
    return await this.jwtService.signAsync(payload);
  }
  async registration(userData: RegistrationUserDto) {
    const data: RegistrationUserDto = await this.clearSpace(userData);
    const checkEmptyData = this.checkForEmptyData(data, 'register');
    const validateData = this.validateData(data, 'register');

    if (typeof checkEmptyData === 'string')
      throw new HttpException(checkEmptyData, HttpStatus.BAD_REQUEST);

    if (typeof validateData === 'string')
      throw new HttpException(validateData, HttpStatus.BAD_REQUEST);

    // check user phone or email for exists
    const userExistsForPhone = await this.usersService.getUserByPhone(
      data.phone,
    );
    const userExistsForEmail = await this.usersService.getUserByEmail(
      data.email,
    );

    if (userExistsForPhone)
      throw new HttpException(
        `User with phone ${userData.phone} exists`,
        HttpStatus.BAD_REQUEST,
      );

    if (userExistsForEmail)
      throw new HttpException(
        `User with email ${userData.email} exists`,
        HttpStatus.BAD_REQUEST,
      );

    // create user
    const saveUser = await this.usersService.createUser(data);
    const user = await this.usersService.getUserById(saveUser.id);
    // const subscription: Subscriptions =
    //   await this.subscriptionsService.createSubscription({
    //     start: new Date(),
    //     end: new Date(),
    //     amount: 0,
    //     user: user,
    //   });
    // const updateUserWithSub = await this.usersService.updateUser(user.id, {
    //   subscription,
    // });
    return {
      role: user.role,
      tokenExpires: process.env.JWT_EXPIRESIN,
      token: await this.generateToken(user),
    };
  }
  async login(userData: LoginUserDto) {
    const data = await this.clearSpace(userData);
    const checkEmpty = this.checkForEmptyData(data, 'login');
    const validateData = this.validateData(data, 'login');

    if (typeof checkEmpty === 'string')
      throw new HttpException(checkEmpty, HttpStatus.BAD_REQUEST);

    if (typeof validateData === 'string')
      throw new HttpException(validateData, HttpStatus.BAD_REQUEST);

    const loginEmail = data.login.indexOf('@');
    const loginPhone = data.login.slice(0, 2) === '+7';

    if (loginEmail !== -1) {
      const user: User = await this.usersService.getUserByEmail(data.login);

      if (user !== null) {
        // check password
        const passwordEquals = await this.usersService.comparePassword(
          data.password,
          user.password,
        );

        if (!passwordEquals)
          throw new HttpException(
            'Incorrect login or password',
            HttpStatus.BAD_REQUEST,
          );

        // send token user
        return {
          role: user.role,
          tokenExpires: process.env.JWT_EXPIRESIN,
          token: await this.generateToken(user),
        };
      } else throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
    } else if (loginPhone) {
      const user: User = await this.usersService.getUserByPhone(data.login);

      if (user !== null) {
        // check password
        const passwordEquals = await this.usersService.comparePassword(
          data.password,
          user.password,
        );

        if (!passwordEquals)
          throw new HttpException(
            'Incorrect login or password',
            HttpStatus.BAD_REQUEST,
          );

        // send token user
        return {
          role: user.role,
          tokenExpires: process.env.JWT_EXPIRESIN,
          token: await this.generateToken(user),
        };
      } else throw new HttpException('User not exists', HttpStatus.NOT_FOUND);
    } else throw new HttpException('Incorrect value', HttpStatus.BAD_REQUEST);
  }

  // ADMIN LOGIN

  async loginAdmin(adminData: LoginAdminDto) {
    const admin = await this.adminService.getAdmin(adminData);
    if (!admin)
      throw new HttpException(
        'Invalid login or password',
        HttpStatus.BAD_REQUEST,
      );
    return {
      role: 'ADMIN',
      tokenExpires: process.env.JWT_EXPIRESIN,
      token: await this.generateToken(admin),
    };
  }
}
