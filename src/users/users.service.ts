import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Account {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  age?: number;
}

@Injectable()
export class UsersService {
  private filePath = path.join(__dirname, '../../data/accounts.json');

  private readAccounts(): Account[] {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, '[]');
    }
    const data = fs.readFileSync(this.filePath, 'utf8');
    return JSON.parse(data);
  }

  private writeAccounts(accounts: Account[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(accounts, null, 2), 'utf8');
  }

  findUser(username: string): Account | undefined {
    const accounts = this.readAccounts();
    return accounts.find(acc => acc.username === username);
  }

  addUser(username: string, password: string): boolean {
    const accounts = this.readAccounts();
    if (accounts.find(acc => acc.username === username)) {
      return false; // user đã tồn tại
    }
    accounts.push({
      username,
      password,
      email: '',
      nickname: username,
      age: null,
    });
    this.writeAccounts(accounts);
    return true;
  }
    updateUser(username: string, updates: Partial<Account>): boolean {
    const accounts = this.readAccounts();
    const user = accounts.find(acc => acc.username === username);
    if (!user) return false;

    Object.assign(user, updates);
    this.writeAccounts(accounts);
    return true;
  }

  validate(username: string, password: string): boolean {
    const accounts = this.readAccounts();
    return accounts.some(acc => acc.username === username && acc.password === password);
  }
}
