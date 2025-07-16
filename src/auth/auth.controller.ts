import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: {username: string, password: string}) :any {
    const valid = this.authService.validate(body.username, body.password);
    return valid ? {status: 'ok'} : {status: 'fail'};
  }
}
