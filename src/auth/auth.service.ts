import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  validate(username: string, password: string): boolean {
    const user = this.usersService.findUser(username);
    return user && user.password === password;
  }
}
