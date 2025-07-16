import { Injectable } from '@nestjs/common';
import { accounts } from '../accounts/accounts';

@Injectable()
export class UsersService {
  findUser(username: string) {
    return accounts.find(acc => acc.username === username);
  }
  addUser(username: string, password: string) {
  accounts.push({
    username,
    password,
    email: '',
    nickname: username,
    age: null,
  });
}
}


