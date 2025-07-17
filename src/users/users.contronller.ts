import { Controller, Post, Body, Patch } from '@nestjs/common';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post('register')
register(@Body() body: { username: string, password: string }) {
  const user = this.usersService.findUser(body.username);
  if (user) {
    return { status: 'fail', message: 'Tài khoản đã tồn tại' };
  }
  this.usersService.addUser(body.username, body.password);
   const newuser = this.usersService.findUser(body.username);
  return { status: 'ok',user :newuser }; 
}
  @Post('login')
  login(@Body() body: {username: string, password: string})  {
    const valid =  this.usersService.validate(body.username,body.password);
    if(valid){
      const user = this.usersService.findUser(body.username);
        return { status: 'ok', user :user }; 
    }
    return { status: 'fail', message: 'sai tk' };
  }


  @Post('update')
  update(@Body() body: { username: string, updates: Partial<{password:string, email: string, nickname: string, age: number }> }) {
   const ok = this.usersService.updateUser(body.username, body.updates);
  if (!ok) {
    return { status: 'fail', message: 'User not found' };
  }
  const updatedUser = this.usersService.findUser(body.username);
  return { status: 'ok', user: updatedUser };
  }
}



