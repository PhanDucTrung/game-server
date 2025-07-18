// src/models/account.model.ts

export class Account {
  username: string;
  password: string;
  email?: string;
  nickname?: string;
  age?: number;

  constructor(data: Partial<Account>) {
    this.username = data.username ?? '';
    this.password = data.password ?? '';
    this.email = data.email ?? '';
    this.nickname = data.nickname ?? this.username;
    this.age = data.age ?? null;
  }
}
