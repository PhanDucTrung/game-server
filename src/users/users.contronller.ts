import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//   @Post('register')
//   register(@Body() user: User) {
//     return this.usersService.create(user);
//   }

//   @Patch('update')
//   update(@Body() body: {username: string, data: Partial<User>}) {
//     return this.usersService.update(body.username, body.data);
//   }
 }
